        // ==== 事件前置-随机事件数量（随机抽取随机事件数量确定） =====
        function drawRandomCount() {
            const r = Math.random();
            if (r < 0.20) return 0;
            if (r < 0.70) return 1;
            if (r < 0.90) return 2;
            return 3;
        }

        // ==== 事件前置-随机事件存储（返回本季度可抽的随机事件） ====
        function getAvailableRandomPool() {
          const seasonKey = `${student.age}-${student.seasonIndex}`;

          // 1) 合并三类事件为一个候选池
          const all = [
            ...(gameData.events.random_events || []),
            ...(gameData.events.conditional_events || []),
            ...(gameData.events.threshold_events || []),
          ];

          // 2) 统一过滤规则
          const pool = all.filter(ev => {
            // 季节限制（可选）
            const okSeason = !ev.availableSeasons || ev.availableSeasons.includes(seasonKey);

            // 条件过滤（可选）
            const okCond = !ev.condition || ev.condition(student, gameData);

            // 概率门（可选，默认 1）
            const p = (typeof ev.prob === "number") ? Math.max(0, Math.min(1, ev.prob)) : 1;
            const okProb = Math.random() < p;

            // 完成/可重复
            const okRepeat = ev.repeatable || !student.completedEvents[ev.id];

            // 本季已出现去重
            const okDedup = !student.thisSeasonAppeared.includes(ev.id);

            return okSeason && okCond && okProb && okRepeat && okDedup;
          });

          return pool;
        }


        // ===== 事件前置-检查前置条件 =====
        function checkPrerequisites(prereq) {
            if (!prereq) return true; // 无前缀，直接通过
            const list = Array.isArray(prereq) ? prereq : [prereq];
            return list.every(id => student.completedEvents[id]);
        }
      
        // ======= 打开事件 =======
        function openEvent(event) {
            if (student.completedEvents[event.id]) {
              alert("该事件已完成,无法再次进入！");
              return;
            }
          
            if (!checkPrerequisites(event.prerequisite)) {
                alert("前置条件未达成！需要完成：" + 
                      (Array.isArray(event.prerequisite) ? event.prerequisite.join(", ") : event.prerequisite));
                return;
            }
                        
            currentOpenEvent = event;
            const modal = document.getElementById("event-modal");
            const title = document.getElementById("event-modal-title");
            const body = document.getElementById("event-modal-body");
            
            title.textContent = event.title;
            
            let html = `<div class="event-story">${event.desc}</div>`;
            
            if (event.options) {
                html += '<div class="event-options">';
                event.options.forEach((option, index) => {
                    html += `<button class="option-btn" onclick="executeEventOption(${index})">${option.text}</button>`;
                });
                html += '</div>';
            }
            
            body.innerHTML = html;
            modal.style.display = "block";
        }

        // ===== 执行事件-执行点击并标记完成 ====
        function executeEventOption(index) {
            if (currentOpenEvent && currentOpenEvent.options[index]) {
                // 标记为本季度已完成（阻止本季度再次显示）
                if (!student.thisSeasonCompleted.includes(currentOpenEvent.id)) {
                    student.thisSeasonCompleted.push(currentOpenEvent.id);
                }
                
                // 对于不可重复事件，同时标记全局完成
                if (!currentOpenEvent.repeatable) {
                    student.completedEvents[currentOpenEvent.id] = true;
                }
                
                currentOpenEvent.options[index].action();
            }
        }

        // ===== 事件分支弹窗（在弹窗里继续讲下一段故事）====
        function continueInModal(story) {
            currentContinueStory = story;          // ① 挂到全局
            const body = document.getElementById("event-modal-body");
            let html = `<div class="event-story">${story.desc}</div>`;
            if (story.options) {
                html += '<div class="event-options">';
                story.options.forEach((opt, idx) => {
                    // ② 调用时不再传 story，用全局变量
                    html += `<button class="option-btn" onclick="handleContinueOption(${idx})">${opt.text}</button>`;
                });
                html += '</div>';
            }
            body.innerHTML = html;
        }

        // ===== 事件分支后续（处理“后续选项”）======
        function handleContinueOption(idx) {
            const opt = currentContinueStory.options[idx];
            if (opt.action) opt.action();   // 执行数值/文案
            // 如果还有下一段，继续套娃；否则已在上面的 action 里 closeEventModal
        }

        // ===== 事件后续--调节小于0或大于100的参数======
        function AdjustAttributes(attrName){
            if (student.attributes[attrName] < 0){
                student.attributes[attrName] = 0;
            }else if(student.attributes[attrName] > 100){
                student.attributes[attrName] = 100;
            }
            return;
        }

        // ===== 关闭事件 =====
        function closeEventModal() {
            document.getElementById("event-modal").style.display = "none";
            currentOpenEvent = null;
            renderAll();
        }

        // 根据分数拿到冲/稳/保三档；可选 alert 直观显示
        function getChoicesByScore(score, shouldAlert = false) {
          const seg = GAOKAO_DB.find(s => score >= s.min && score <= s.max);

          const pickTier = (list) => {
            if (!list || list.length === 0) return [];
            const need = list.length >= 2 ? 2 : 1;   // ≥2 取2；=1 取1
            return sampleN(list, need);
          };

          const res = seg ? {
            reach:  pickTier(seg.reach),
            target: pickTier(seg.target),
            safety: pickTier(seg.safety),
          } : { reach: [], target: [], safety: [] };

          if (shouldAlert) {
            const show = (arr) => (arr && arr.length) ? arr.join('、') : '（暂无推荐）';
            alert(
              `你的分数： ${score} 分，最终志愿填报情况：\n\n` +
              `🎯 冲刺：${show(res.reach)}\n` +
              `✅ 求稳：${show(res.target)}\n` +
              `🛡 保底：${show(res.safety)}`
            );
            showReport(`你的分数 ${score} 分，经过与家里协商，你填报了这些大学：🎯 冲刺：${show(res.reach)} ✅ 求稳：${show(res.target)} 🛡 保底：${show(res.safety)}`)
          }

          return res;
        }


        // 从一个数组里随机拿一所学校
        function pickOne(arr) {
          if (!arr || arr.length === 0) return null;
          const i = Math.floor(Math.random() * arr.length);
          return arr[i];
        }

        // 顺序概率录取：先冲刺(0.3)，失败则求稳(0.7)，仍失败则保底(1)
        function simulateAdmissionSequential(score) {
          const { reach, target, safety } = getChoicesByScore(score,true);

          const hasReach  = reach && reach.length;
          const hasTarget = target && target.length;
          const hasSafety = safety && safety.length;

          // 如果有冲刺且命中 0.3
          if (hasReach && Math.random() < 0.3) {
            return { tier: "冲刺", university: pickOne(reach) };
          }

          // 冲刺失败或无冲刺：如果有求稳且命中 0.7
          if (hasTarget && Math.random() < 0.7) {
            return { tier: "求稳", university: pickOne(target) };
          }

          // 保底（保证命中）——若保底为空，做兜底回退到非空池
          if (hasSafety) {
            return { tier: "保底", university: pickOne(safety) };
          }

          // 兜底：极端情况下某档为空，回退到有学校的那一档
          if (hasTarget) return { tier: "求稳", university: pickOne(target) };
          if (hasReach)  return { tier: "冲刺", university: pickOne(reach) };

          // 实在没有（不太可能），返回 null
          return { tier: "无可选", university: null };
        }

        // 从数组里随机抽取 n 个不重复元素
        function sampleN(arr, n) {
          const a = [...(arr || [])];
          const out = [];
          while (a.length && out.length < n) {
            out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
          }
          return out;
        }

        // 按文/理抽取 5 个专业
        function getRandomMajorsByStream(stream, n = 5) {
          const pool = MAJOR_DB[stream] || [];
          // 万一当前库少于 n，就先打散再切片
          if (pool.length <= n) {
            return [...pool].sort(() => Math.random() - 0.5).slice(0, n);
          }
          return sampleN(pool, n);
        }


console.log("加载了第二个函数文件，事件相关文件js")
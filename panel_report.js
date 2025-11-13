        // 学习/工作面板（新弹窗版本，不清空报告栏）
        function openStudyPanel() {
          const modal = document.getElementById('study-modal');
          const box   = document.getElementById('study-actions');

          // 填入按钮（你可以按需继续加）
          if(student.work==null){
            box.innerHTML = `
            <button class="panel-btn"        onclick="showScores('📊 最近一次考试成绩')">📊 查看成绩</button>       
            <button class="panel-btn" onclick="studyAction()">📚 自主学习</button>
            <button class="panel-btn"        onclick="FindPartTimeJob()">👔 寻找兼职</button>
          `;
          if(student.completedEvents.College_entrance_examination_score_checking){
            box.innerHTML +=`<button class="panel-btn"        onclick="showGaokaoScores('📊🎓️ 高考成绩')">📊 查看高考成绩</button>`
          }
          }
          

          // 打开
          modal.style.display = 'flex';
        }

        // 关闭学习/工作弹窗
        function closeStudyModal() {
          const modal = document.getElementById('study-modal');
          if (modal) modal.style.display = 'none';
        }

        // （可选）点击遮罩关闭
        document.getElementById('study-modal')?.addEventListener('click', (e) => {
          if (e.target.id === 'study-modal') closeStudyModal();
        });

        // （可选）按 ESC 关闭
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') closeStudyModal();
        });

        function studyAction(){
          if (student.quarterActions.self_learn) {
            alert("本季度已经学了不少，适当放松一下吧");
            showReport("📚 本季度『自主学习』次数已用完。");
            return;
          }
          const gain = 2;
          const learn_course=Math.ceil(Math.random()*5);
          if(learn_course==1){
            student.attributes.iq = Math.min(100, student.attributes.iq + gain);
            showReport(`自己看了会数学书，智商 +${gain}。`);
          }else if(learn_course==2){
            student.attributes.eq = Math.min(100, student.attributes.eq + gain);
            showReport(`自己看了会文学读物，情商 +${gain}。`);
          }else if(learn_course==3){
            student.attributes.memory = Math.min(100, student.attributes.memory + gain);
            showReport(`自己看了会英语单词，记忆力 +${gain}。`);
          }else if(learn_course==4){
            student.attributes.logic = Math.min(100, student.attributes.logic + gain);
            showReport(`自己看了会编程设计博客，逻辑 +${gain}。`);
          }else if(learn_course==5){
            student.attributes.engineering = Math.min(100, student.attributes.engineering + gain);
            showReport(`自己看了会工程实例分析，工程能力 +${gain}。`);
          }     
          student.quarterActions.self_learn = true;  // 标记已用         
        }

        function FindPartTimeJob(){
          if ((student.seasonIndex < 2)&&(student.age==18)){
            alert("💰 现在这个阶段，还是集中精力到学业上吧！");
            showReport("💰 高中毕业前无法兼职打工。");
            return
          }

        }
        
        /* ===== 打开社交/娱乐弹窗（不影响报告栏） ===== */
        function openSocialPanel() {
          const modal = document.getElementById('social-modal');
          const box   = document.getElementById('social-actions');

          let html = `
            <button class="panel-btn" onclick="openWeChatPanel()">🟢 微信（与认识的人社交）</button>
            <button class="panel-btn"        onclick="playGameAction()">🎮 打游戏</button>
            <button class="panel-btn"        onclick="goParkAction()">🌳 去公园闲逛</button>
            <button class="panel-btn"        onclick="watchShowAction()">📺 看剧</button>
          `;

          if(student.love!= null){
            html +=`<button class="panel-btn"        onclick="dating()" >💖 约会</button>`;
          }

          box.innerHTML = html;
          modal.style.display = 'flex';
        }

        /* 关闭社交弹窗 */
        function closeSocialModal() {
          const modal = document.getElementById('social-modal');
          if (modal) modal.style.display = 'none';
        }

        /* ===== 微信联系人弹窗 ===== */
        function openWeChatPanel() {
          const modal = document.getElementById('wechat-modal');
          const list  = document.getElementById('wechat-list');

          const known = getKnownNPCs();

          if (!known.length) {
            list.innerHTML = `<div style="color:#666;">目前还没有认识的人。多参加活动或推进主线事件试试～</div>`;
          } else {
            list.innerHTML = known.map(npc => renderWeChatItem(npc)).join('');
          }

          modal.style.display = 'flex';
        }

        /* 关闭微信弹窗 */
        function closeWeChatModal() {
          const modal = document.getElementById('wechat-modal');
          if (modal) modal.style.display = 'none';
        }
        
        function renderWeChatItem(npc) {
          const favor = getFavor(npc);
          const initials = npc.name?.slice(0,2) || "好友";
          const avatarHtml = npc.avatarUrl
            ? `<img src="${npc.avatarUrl}" alt="${npc.name}">`
            : `<span>${initials}</span>`;

          const qa = student.quarterActions?.npc || {};
          const used = qa[npc.id] || {};
          const dis = k => used[k] ? 'disabled aria-disabled="true"' : '';

          return `
            <div class="wechat-item">
              <div class="wechat-avatar">${avatarHtml}</div>
              <div class="wechat-info">
                <div class="wechat-name">${npc.name} <span style="color:#888;font-size:12px;">· ${npc.role}</span></div>
                <div class="wechat-meta">年龄：${npc.age} | 好感度：${favor}</div>
                <div class="favor-bar"><div class="favor-fill" style="width:${favor}%;"></div></div>
                <div class="wechat-actions">
                  <button ${dis('chat')}  onclick="interactNPC('${npc.id}','chat')">💬 聊天</button>
                  <button ${dis('gift')}  onclick="interactNPC('${npc.id}','gift')">🎁 送礼</button>
                  <button ${dis('study')} onclick="interactNPC('${npc.id}','study')">📖 学习</button>
                  <button ${dis('tease')} onclick="interactNPC('${npc.id}','tease')">😅 打趣</button>
                </div>
              </div>
            </div>
          `;
        }


        function _ensureQA() {
          if (!student.quarterActions) {
            student.quarterActions = { game:false, park:false, show:false, dating:false, npc:{} };
          }
          if (!student.quarterActions.npc) student.quarterActions.npc = {};
        }

        function canInteractThisQuarter(npcId, action) {
          _ensureQA();
          const used = student.quarterActions.npc[npcId]?.[action];
          return !used;  // 未使用才可互动
        }

        function markInteractThisQuarter(npcId, action) {
          _ensureQA();
          if (!student.quarterActions.npc[npcId]) student.quarterActions.npc[npcId] = {};
          student.quarterActions.npc[npcId][action] = true;
        }


        function interactNPC(id, action) {
          const npc = NPC_DB.find(n => n.id === id);
          if (!npc) return;

          if (!canInteractThisQuarter(id, action)) {
            alert(`本季度已对【${npc.name}】使用过『${actionLabel(action)}』，下季度再来吧。`);
            showReport(`⏳ 本季度已对 ${npc.name} 使用过『${actionLabel(action)}』。`);
            return;
          }

          let delta = 0;
          let msg = "";
          switch (action) {
            case 'chat':
              delta = 2 + Math.floor(Math.random()*3); // +2~4
              student.attributes.eq = Math.min(100, student.attributes.eq + 1);
              msg = `你和 ${npc.name} 闲聊，气氛愉快。好感 +${delta}，情商 +1。`;
              break;
            case 'gift':
              delta = 4 + Math.floor(Math.random()*4); // +4~7
              msg = `你给 ${npc.name} 准备了小礼物。好感 +${delta}。`;
              break;
            case 'study':
              delta = 3;
              student.attributes.memory = Math.min(100, student.attributes.memory + 1);
              msg = `你和 ${npc.name} 一起学习。好感 +${delta}，记忆 +1。`;
              break;
            case 'tease':
              delta = - (2 + Math.floor(Math.random()*3)); // -2~-4
              msg = `你和 ${npc.name} 打趣过头了……好感 ${delta}。`;
              break;
          }

          const newFavor = Math.max(0, Math.min(100, getFavor(npc) + delta));
          setFavor(npc, newFavor);

          // ✅ 标记本季度：该 NPC 的该行为已用
          markInteractThisQuarter(id, action);

          // 刷新 UI
          openWeChatPanel();
          showReport(`🟢 微信 · ${msg}`);
        }

        function actionLabel(a) {
          return ({ chat:'聊天', gift:'送礼', study:'一起学习', tease:'聊八卦' }[a] || a);
        }


        /* ===== 其他社交娱乐动作 ===== */
        function playGameAction() {
          if (student.quarterActions.game) {
            alert("最近没少打游戏，过段时间再放松吧！");
            showReport("⏳ 本季度『打游戏』次数已用完。");
            return;
          }
          const gain = 3;
          student.attributes.happy = Math.min(100, student.attributes.happy + gain);
          student.quarterActions.game = true;  // 标记已用
          showReport(`🎮 打游戏放松了一会儿，心情 +${gain}。`);
        }


        function goParkAction() {
          if (student.quarterActions.park) {
            alert("最近没少去公园，下季度再去吧。");
            showReport("⏳ 本季度『去公园』次数已用完。");
            return;
          }
          const gain = 2 + Math.floor(Math.random()*3); // +2~4
          student.attributes.health = Math.min(100, student.attributes.health + gain);
          student.attributes.happy  = Math.min(100, student.attributes.happy + gain);
          student.quarterActions.park = true;  // 标记已用
          showReport(`🌳 公园散步，身心舒畅。健康 +${gain}，心情 +${gain}。`);
        }


        function watchShowAction() {
          if (student.quarterActions.show) {
            alert("最近看剧看的眼睛疼，下季度再追！");
            showReport("⏳ 本季度『看剧』次数已用完。");
            return;
          }
          const gain = 2;
          student.attributes.happy = Math.min(100, student.attributes.happy + gain);
          student.quarterActions.show = true;  // 标记已用
          showReport(`📺 追剧小憩，心情 +${gain}。`);
        }

        // 每季度：约会一次
        function dating() {
          // 1) 次数限制
          if (!student.quarterActions) student.quarterActions = {};
          if (student.quarterActions.dating) {
            alert("最近已经约会过了，过段时间再约吧！");
            showReport("💖 本季度『约会』次数已用完。");
            return;
          }

          // 2) 计算恋人 id（按你的性别/恋爱状态规则）
          if (!student.love) {
            alert("你还没有恋人，先去发展一段关系吧～");
            return;
          }
          let loveId = null;
          if (student.gender === 1) {
            // gender==1 走 boy 分支（按你给的代码）
            loveId = `love_friend_boy_${student.love}`;
          } else {
            loveId = `love_friend_girl_${student.love}`;
          }

          // 3) 找到对应 NPC
          const npc = NPC_DB.find(n => n.id === loveId);
          if (!npc) {
            alert("没有找到对应的恋人 NPC（请检查 NPC_DB 配置或 id 命名）。");
            return;
          }

          // 4) 确保“认识”（如果需要：标记已认识）
          // if (!socialState.known[npc.id]) {
          //   socialState.known[npc.id] = true;  // 可选：强制认为已认识
          // }

          // 5) 增加好感 / 属性
          const gainHappy = 5;
          const gainFavor = 5;
          const currentFavor = getFavor(npc);
          setFavor(npc, currentFavor + gainFavor);
          student.attributes.happy = Math.min(100, student.attributes.happy + gainHappy);

          // 6) 标记本季度已用
          student.quarterActions.dating = true;

          // 7) 日志
          showReport(`💖 和恋人 ${npc.name} 一起约会了：好感 +${gainFavor}，心情 +${gainHappy}。`);

          // 8) 若你有“微信联系人弹窗”在开着，刷新一下列表显示最新好感
          const wechatModal = document.getElementById('wechat-modal');
          if (wechatModal && wechatModal.style.display === 'flex') {
            openWeChatPanel(); // 复用渲染函数刷新
          }
        }




        // 其他行动面板
        function openOtherPanel() {
            showReport('其他行动开发中...');
        }
        
        // 选项栏面板（显示当前事件选项）
        function openOptionPanel() {
            showReport('选项栏拟包括保存功能和开发功能，开发中...');
        }

        // 在任意动作后输出报告
        function showReport(message) {
            const reportContent = document.getElementById('report-content');
            const time = new Date().toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            // 创建报告项
            const reportItem = document.createElement('div');
            reportItem.className = 'report-item';
            reportItem.innerHTML = `<span style="color:#999;font-size:11px;">[${time}]</span> ${message}`;
            
            // 添加到内容底部（会自动向上推）
            reportContent.appendChild(reportItem);
            
            // 滚动到底部（显示最新）
            const panel = document.getElementById('report-panel');
            panel.scrollTop = panel.scrollHeight;
            
            // 保存到历史（用于后续查看）
            student.reports.push({ time, message });
            
            // 限制最多显示50条（防止过多）
            const items = reportContent.querySelectorAll('.report-item');
            if (items.length > 50) {
                items[0].remove();  // 删除最早的
                student.reports.shift();
            }
        }

        // 清除报告（季度切换时调用）
        function clearReports() {
            document.getElementById('report-content').innerHTML = '';
            // 不清空 student.reports，保留历史
        }

        // ===== 显示成绩弹窗 =====
        function showScores(examname="考试成绩") {
            if (!student.lastExamScores) {
                alert("还没有参加过考试！");
                return;
            }
            
            const modal = document.getElementById("scores-modal");
            const list = document.getElementById("scores-list");
            
             // 新增：设置标题
              const h2 = modal.querySelector("h2");
              if (h2) h2.textContent = examname;

            let html = '';
            let total = 0;
            const subjectsToShow = student.major === "文科" 
                ? ["politics", "history", "geography", "math", "chinese", "english"]
                : ["physics", "chemistry", "biology", "math", "chinese", "english"];
            
            subjectsToShow.forEach(key => {
                const score = student.lastExamScores[key];
                total += score;
                html += `
                    <div class="score-item">
                        <span>${gameData.subjects[key].name}</span>
                        <span><strong>${score}分</strong></span>
                    </div>
                `;
            });
            
            html += `
                <div class="score-item score-total">
                    <span>📊 总分</span>
                    <span><strong>${total}分</strong></span>
                </div>
            `;
            
            list.innerHTML = html;
            modal.style.display = "block";
        }

        function showGaokaoScores(title = "📊🎓️ 高考成绩") {
          // 需要有已保存的分数与明细
          if (student.gaokaoScore == null || !student.lastExamScores) {
            alert("还没有高考成绩可展示。");
            return;
          }

          const modal = document.getElementById("scores-modal");
          const list  = document.getElementById("scores-list");

          // 设置标题（你若在 h2 加了 id="scores-title"，就用它；否则用 querySelector）
          const h2 = document.getElementById("scores-title") || modal.querySelector("h2");
          if (h2) h2.textContent = title;

          // 文/理展示科目
          const subjectsToShow = student.major === "文科"
            ? ["politics", "history", "geography", "math", "chinese", "english"]
            : ["physics", "chemistry", "biology", "math", "chinese", "english"];

          // 生成明细
          let html = "";
          let total = 0;
          subjectsToShow.forEach(key => {
            const score = student.lastExamScores[key] ?? 0;
            total += score;
            html += `
              <div class="score-item">
                <span>${gameData.subjects[key].name}</span>
                <span><strong>${score}分</strong></span>
              </div>
            `;
          });

          // 底部总分 + 已去向（若有）
          html += `
            <div class="score-item score-total">
              <span>📊 总分</span>
              <span><strong>${student.gaokaoScore}分</strong></span>
            </div>
            ${student.university ? `
              <div class="score-item">
                <span>🎓 录取院校</span>
                <span><strong>${student.university}${student.major ? " · " + student.major : ""}</strong></span>
              </div>
            ` : ""}
          `;

          list.innerHTML = html;

          // 显示弹窗
          modal.style.display = "block";
        }


        // ===== 关闭成绩弹窗 =====
        function closeScoresModal() {
            document.getElementById("scores-modal").style.display = "none";
        }


        /* ===== 工具：获取“已认识”的 NPC 列表 ===== */
function getKnownNPCs() {
  return NPC_DB.filter(npc => {
    if (socialState.known[npc.id]) return true;
    if (npc.alwaysKnown) return true;
    if (typeof npc.condition === 'function') {
      try { return !!npc.condition(); } catch { return false; }
    }
    return false;
  });
}

/* ===== 工具：读/写 好感度 ===== */
function getFavor(npc) {
  const v = socialState.favor[npc.id];
  return typeof v === 'number' ? v : npc.favor || 30;
}
function setFavor(npc, val) {
  socialState.favor[npc.id] = Math.max(0, Math.min(100, Math.round(val)));
}
        console.log("加载了第三个函数文件，报告栏和行动栏js")
        // ===== 显示游戏开始弹窗 =====
        function showStartModal() {
            const modal = document.getElementById("start-modal");
            const input = document.getElementById("player-name-input");
            if (!modal) return;

            modal.style.display = "flex";   // 对应 CSS 里的 flex 布局
            if (input) {
                input.value = "";
                input.focus();
            }
        }

        // ===== 确认开始游戏（起名） =====
        function confirmStartGame() {
              const input = document.getElementById("player-name-input");
              const typed = (input?.value || "").trim();

              // 有输入就用输入；没有输入就保留/设定默认名
              if (typed) {
                student.name = typed;
              } else {
                // 如果之前没名，就按性别给默认名（不会覆盖已有名）
                if (!student.name) {
                  student.name = (student.gender === 1) ? "王小明" : "王小美";
                }
              }

            // 关闭开始弹窗
            const modal = document.getElementById("start-modal");
            if (modal) {
                modal.style.display = "none";
            }

            // 正式渲染主界面
            renderAll();
            renderEvents(true);   // 第一次进入，允许抽随机事件

            // 在报告栏里添加一个欢迎提示
            showReport(`👋 ${student.name} 的高三一年开始了！当前为 ${student.age} 岁 ${gameData.seasons[student.seasonIndex]}，你是 ${student.major} 生。`);
            const init_attribute = student.attributes.iq+student.attributes.eq+student.attributes.memory+student.attributes.logic+student.attributes.engineering;
            if(init_attribute<150){
              showReport('🟥你的成绩有点糟糕，在最后的这个学期，你一定要更加努力才行！')
            } else if(init_attribute<300){
              showReport('🟧你的成绩在班级是中游，可能努努力还是能冲刺本科的，加油啊！')
            } else if(init_attribute<450){
              showReport('🟨你的成绩还算不错，最后一个学期，可不能懈怠了！')
            } else{
              showReport('🟩你是班里数一数二的学霸，为了考上清华北大，这三年你从未懈怠。')
            }
        }
    
        // ===== 初始化游戏 =====
        function initGame() {
            clearReports();
            gameData.events = gameEventsData;
            student.gender = Math.random() < 0.5 ? 1 : 0;
            student.age = 18;
            student.seasonIndex = 0;
            student.attributes = {
                iq: Math.min(100,Math.round((2*student.Student_level-1)*10+Math.random()*30)),
                eq: Math.min(100,Math.round((2*student.Student_level-1)*10+Math.random()*30)),
                memory: Math.min(100,Math.round((2*student.Student_level-1)*10+Math.random()*30)),
                logic: Math.min(100,Math.round((2*student.Student_level-1)*10+Math.random()*30)),
                engineering: Math.min(100,Math.round((2*student.Student_level-1)*10+Math.random()*30)),
                happy:80,
                sport:10+Math.round(Math.random()*90),
                charm:20*Math.round(Math.random()*5),
                health:100,
                luck: 50, // 隐藏参数
                languages: Math.min(100,Math.round((2*student.Student_level-1)*10+Math.random()*30)) // 隐藏参数
            
            
            };
          
            // 随机性格
            student.personality = gameData.personalities[
                Math.floor(Math.random() * gameData.personalities.length)
            ];
            student.completedEvents = {}; 
            // 应用性格加成
            for(let attr in student.personality.bonus) {
                student.attributes[attr] = Math.min(100, 
                    student.attributes[attr] + student.personality.bonus[attr]);
            }
            
            // 随机分文理科
            if (student.attributes.iq > 80 && student.attributes.logic > 80) {
                student.major = "理科";
            } else if (student.attributes.eq > 80 && student.attributes.memory > 80) {
                student.major = "文科";
            } else {
                student.major = Math.random() > 0.8 ? "文科" : "理科";
            }
            student.Highschool_Arts_and_Sciences = student.major;
            // 初始化分数
            for(let subj in gameData.subjects) {
                student.scores[subj] = 0;
            }

            student.chapter = "highschool";     // 当前章节
            student.collegeIntroShown = false;  // 是否已显示“大学篇”弹窗

            
            // renderAll();
            // renderEvents()
            if (!student.name) {
                if(student.gender==1){
                    student.name = "王小明";
                }else{
                    student.name = "王小美";
                }   
            }
            showStartModal(); 

        }  


        // ===== 下一季度 =====
        function nextSeason() {
            // 1. 检查本季度事件是否全部完成（只要求不可重复事件）
            const currentKey = `${student.age}-${student.seasonIndex}`;
            const events = [];
        
            const fixed = gameData.events[currentKey];
            if (Array.isArray(fixed)) events.push(...fixed);
            else if (fixed) events.push(fixed);
        
            // 随机事件（本季度已抽取的）
            events.push(...student.seasonRandomEvents);
        
            // 找出“未完成的、且不可重复”的事件
            const unfinished = events.filter(event => {
                // 可重复事件：不强制要求本季度完成
                if (event.repeatable) return false;
        
                // 不可重复事件：必须在 completedEvents 里出现
                return !student.completedEvents[event.id];
            });
        
            if (unfinished.length > 0) {
                const titles = unfinished.map(e => e.title).join('、');
                alert(`⚠️ 还有 ${unfinished.length} 个【关键事件】未完成：${titles}\n请处理完这些关键事件后再进入下一季度！`);
                return; // 阻止切换
            }
        
            // ✅ 注意：在真正进入下一季之前，不要清 thisSeasonCompleted
            // 真正切季再清：
            student.thisSeasonCompleted = [];
            student.seasonRandomEvents = [];
            student.thisSeasonAppeared = [];
        
            // 2. 进入下一季度（你原来的逻辑继续）
            student.seasonIndex = (student.seasonIndex + 1) % 4;
            if (student.seasonIndex === 0) {
                student.age++;
            }
        
            // 3. 清空可重复事件的完成记录（让它们下季度还能出现）
            for (let id in student.completedEvents) {
                const event = gameData.events.random_events.find(e => e.id === id);
                if (event?.repeatable) {
                    delete student.completedEvents[id];
                }
            }
            
            // 每个季度随机增长能力
            const attrs = ["iq", "eq", "memory", "logic", "engineering"];
            attrs.forEach(attr => {
                const growth = Math.random() * 3;
                student.attributes[attr] = Math.min(100, 
                    Math.round(student.attributes[attr] + growth));
            });
            
            renderAll();  
            renderEvents()
            // 季节提示
            const seasonTips = [
                "春天到了,春风轻拂,鸟语花香。新的事件发生了！",
                "夏天到了,蝉鸣阵阵,树荫微凉。新的事件发生了！",
                "秋天到了,落叶轻摇,桂花飘香。新的事件发生了！",
                "冬天到了,雪落无声,炉火温茶。新的事件发生了！"
            ];
            const seasonNames = ["春季", "夏季", "秋季", "冬季"];
            showReport(`<strong>🍃 进入${student.age}岁${seasonNames[student.seasonIndex]}，新的事件发生了！</strong>`);
            // alert(seasonTips[student.seasonIndex]);

            student.quarterActions = { npc:  {
                  "father":{chat:false, gift:false, study:true, tease:true},
                  "mother":{chat:false, gift:false, study:true, tease:true},
                  "teacher_gaosan":{chat:false, gift:false, study:true, tease:true},
                  "deskmate":{chat:false, gift:false, study:false, tease:false},
                  "friend_boy":{chat:false, gift:false, study:false, tease:false},
                  "friend_girl":{chat:false, gift:false, study:false, tease:false},
                  "love_friend_boy_1":{chat:false, gift:false, study:false, tease:false},
                  "love_friend_girl_1":{chat:false, gift:false, study:false, tease:false},
                  "roommate_a":{chat:false, gift:false, study:false, tease:false},
                  "senior_lab":{chat:false, gift:false, study:false, tease:false},
                  "counsellor":{chat:false, gift:false, study:false, tease:false},
                  "club_leader":{chat:false, gift:false, study:false, tease:false},
                  "class_beauty":{chat:false, gift:false, study:false, tease:false},
                  "pro_teacher":{chat:false, gift:false, study:false, tease:false},}, 
                  game:false, park:false, show:false, dating:false };

          if (student.seasonIndex<2&&student.age==18){
            showReport("💵 获得零花钱200元");
            student.cash+=200;
          }
          
          // 游戏截止到18岁秋天
          if (student.age === 18 && student.seasonIndex === 2 && !student.collegeIntroShown){
            openChapterModal_1();
          }
          if (student.age === 19){
            endGame();
          }
        }

        // ===== 考试评分算法 =====
        function takeExam() {
            const subjectsToTest = student.major === "文科" 
                ? ["math", "chinese", "english","politics", "history", "geography"]
                : ["math", "chinese", "english","physics", "chemistry", "biology"];

            const currentScores = {};
            let sum = 0;
            
            subjectsToTest.forEach(key => {
                const subject = gameData.subjects[key];
                let baseScore = 40;
                
                for(let attr in subject.depends) {
                    const weight = subject.depends[attr];
                    if (key === "math" || key === "chinese" || key === "english") {
                        baseScore += student.attributes[attr] * weight * 1.1; 
                    } else {
                        baseScore += student.attributes[attr] * weight * 0.6;   
                    }
                }
                
                baseScore += Math.random() * 10 - 5;
                
                if (key === "math" || key === "chinese" || key === "english") {
                    currentScores[key] = Math.max(0, Math.min(150, Math.round(baseScore)));
                } else {
                    currentScores[key] = Math.max(0, Math.min(100, Math.round(baseScore)));
                }
                
                student.scores[key] = currentScores[key];
                sum += currentScores[key];
            });
            
            student.scores.all_score = sum;
            student.lastExamScores = {...student.scores}; // 保存本次成绩
          
            return sum;
        }

        // ===== 游戏结束函数 =====
        function endGame() {        
            // 弹结果
            alert(`游戏暂时只开发到这里，感谢体验`);
        
            // 禁用所有操作按钮
            //document.querySelectorAll('#actions button').forEach(btn => btn.disabled = true);
            initGame();
        }


        function openChapterModal_1(){
          fillChapterAdmission();              // ← 先填“大学/专业”
          const m = document.getElementById('chapter-modal');
          if (m) m.style.display = 'flex';
        }
        function closeChapterModal_1(){
          const m = document.getElementById('chapter-modal');
          if (m) m.style.display = 'none';
        }
        function confirmEnterCollege(){
          student.chapter = "college";        // 切换到大学篇
          student.collegeIntroShown = true;   // 标记已显示
          showReport("<strong>🎓 你开启了大学篇：新的人生阶段开始了！</strong>");
          closeChapterModal_1();

          // 这里按需：加载/解锁大学相关事件池、认识新 NPC 等
          // e.g. socialState.known['counsellor'] = true;
          // 或切换事件库：gameData.events = { ...collegeEvents };
        }


        function fillChapterAdmission() {
          // 兼容多种保存位置与空白
          const uni =
            (student.finalUniversity && String(student.finalUniversity).trim()) ||
            (student.admission && student.admission.university && String(student.admission.university).trim()) ||
            "";

          const major =
            (student.finalMajor && String(student.finalMajor).trim()) ||
            (student.admission && student.admission.major && String(student.admission.major).trim()) ||
            "";

          const uniEl   = document.getElementById("chapter-uni");
          const majorEl = document.getElementById("chapter-major");
          const wrapEl  = document.getElementById("chapter-major-wrap");
          const rowEl   = document.getElementById("chapter-offer");

          if (!uniEl || !rowEl) return;

          if (uni) {
            uniEl.textContent = uni;
            rowEl.style.display = "block";
          } else {
            // 没有录取信息时，你可以选择隐藏整行或给出提示
            rowEl.style.display = "none"; // 或者：rowEl.textContent = "尚未确定录取结果";
          }

          if (wrapEl) {
            if (major) {
              majorEl.textContent = major;
              wrapEl.style.display = "inline";
            } else {
              wrapEl.style.display = "none";
            }
          }
        }


      
console.log("加载了第四个函数文件，全局游戏js")
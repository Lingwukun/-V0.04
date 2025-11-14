        // ===== 渲染本季度事件 =====
        function renderEvents(randompara=true) {
            const list = document.getElementById("events-list");
            list.innerHTML = "";
            
            const currentKey = `${student.age}-${student.seasonIndex}`;
            const events = [];
            
            // 检查固定事件
            const fixed = gameData.events[currentKey];
            if (Array.isArray(fixed)) {
                events.push(...fixed);
            }else if (fixed){
                events.push(fixed);
            }
          
            if (randompara) {
                student.thisSeasonAppeared = [];          // 新季度清空
                student.seasonRandomEvents = [];
            
                const pool = getAvailableRandomPool()
                    .filter(ev => !student.thisSeasonAppeared.includes(ev.id)); // 本季度去重
            
                const count = drawRandomCount();
                for (let i = 0; i < count && pool.length; i++) {
                    const idx = Math.floor(Math.random() * pool.length);
                    const ev = { ...pool[idx] };
                    ev.isRandom = true;
                    student.seasonRandomEvents.push(ev);
                    student.thisSeasonAppeared.push(ev.id); // 抽完立即写入去重
                    pool.splice(idx, 1);
                }
            }
        
            // 3. 把缓存的随机事件加入本季度列表
            events.push(...student.seasonRandomEvents);
        
            // 4. 统一渲染
            events.forEach(event => {
                const div = document.createElement("div");
                div.className = "event-item" + (event.isRandom ? " random-event" : "")+(event.isImportant ? " important-event" : "");   // ← 就加这里;
                // 检查是否已完成（本季度 OR 全局）
                const isCompletedThisSeason = student.thisSeasonCompleted.includes(event.id);
                const isCompletedGlobal = !!student.completedEvents[event.id];
                const isCompleted = isCompletedThisSeason || isCompletedGlobal;
                
                if (isCompleted) {
                    div.classList.add("event-completed");
                }
                
                div.innerHTML = `
                    <div class="event-title">
                        ${event.title}
                        ${
                            isCompletedGlobal
                            ? '<span class="completed-badge">已完成</span>'
                            : (isCompletedThisSeason && event.repeatable 
                                ? '<span class="completed-badge">本季度已执行</span>'
                                : ''
                              )
                        }
                    </div>
                    <div class="event-desc">${event.desc.substring(0, 30)}...</div>
                `;

                div.onclick = () => openEvent(event);
                list.appendChild(div);
            });
        }

        // ===== 渲染全部界面 =====
        function renderAll() {
            // 更新顶部信息
                document.getElementById("name-display").textContent = student.name;  // 改成 name-display
                if(student.gender==1){document.getElementById("gender-display").textContent = `男`;}
                else{document.getElementById("gender-display").textContent = `女`;}
                document.getElementById("age-display").textContent = `${student.age}岁`;
                document.getElementById("season-display").textContent = gameData.seasons[student.seasonIndex];
                document.getElementById("major-display").textContent = student.major;  // 新增
                document.getElementById("money-display").textContent = `${student.cash}元`;  // 新增
                if(student.completedEvents.College_entrance_examination_score_checking){
                    document.getElementById("school-display").textContent = `${student.university}`;
                }
            
                renderAttributes();
                renderEvents(false);
                }

        // ===== 渲染参数条（一栏布局） =====
        function renderAttributes() {
            const list = document.getElementById("attributes-list");
            list.innerHTML = "";
            
            const attrs = ["iq", "eq", "happy","memory", "logic", "engineering","sport","charm","health"];
            const names = {iq: "智商", eq: "情商", happy:"心情", memory: "记忆", logic: "逻辑", engineering: "工程", sport:"运动", charm:"魅力", health:"健康"};

            // 直接生成每个属性项，Grid 自动排列
            attrs.forEach(attr => {
                const value = student.attributes[attr];
                const item = document.createElement("div");
                item.className = "attr-item";
                const colorClass = getValueColor(value);   // 先算出颜色
                item.innerHTML = `
                    <div class="attr-header">
                        <div class="attr-name">${names[attr]}</div>
                        <div class="attr-value value-${colorClass}">${value}</div>
                    </div>
                    <div class="mini-progress-bar">
                        <div class="mini-progress-fill ${colorClass}" style="width: ${value}%"></div>
                    </div>
                `;
                list.appendChild(item);
            });
        
            // 可选：动态设置列数（默认 3 列）
            list.style.gridTemplateColumns = `repeat(${list.dataset.cols || 3}, 1fr)`;
            }

        // 渲染工具：能力参数颜色
        function getValueColor(v) {
            if (v <= 33) return "low";
            if (v <= 66) return "medium";
            return "high";
        }


console.log("加载了第一个函数文件，渲染文件js")
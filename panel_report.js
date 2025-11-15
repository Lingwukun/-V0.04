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
            alert(`自己看了会数学书，智商 +${gain}。`);
            showReport(`自己看了会数学书，智商 +${gain}。`);
          }else if(learn_course==2){
            student.attributes.eq = Math.min(100, student.attributes.eq + gain);
            alert(`自己看了会文学读物，情商 +${gain}。`);
            showReport(`自己看了会文学读物，情商 +${gain}。`);
          }else if(learn_course==3){
            student.attributes.memory = Math.min(100, student.attributes.memory + gain);
            alert(`自己看了会英语单词，记忆力 +${gain}。`);
            showReport(`自己看了会英语单词，记忆力 +${gain}。`);
          }else if(learn_course==4){
            student.attributes.logic = Math.min(100, student.attributes.logic + gain);
            alert(`自己看了会编程设计博客，逻辑 +${gain}。`);
            showReport(`自己看了会编程设计博客，逻辑 +${gain}。`);
          }else if(learn_course==5){
            student.attributes.engineering = Math.min(100, student.attributes.engineering + gain);
            alert(`自己看了会工程实例分析，工程能力 +${gain}。`);
            showReport(`自己看了会工程实例分析，工程能力 +${gain}。`);
          }     
          student.quarterActions.self_learn = true;  // 标记已用 
          renderAttributes()
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
            <button class="panel-btn" onclick="openWeChatPanel()">🟢 微信（社交）</button>
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

          // ✅ 送礼改为选择礼物弹窗
          if (action === 'gift') {
            openGiftSelectModal(npc.id);
            return;
          }

          // 其它行为照旧
          let delta = 0, msg = "";
          switch (action) {
            case 'chat':
              delta = 2 + Math.floor(Math.random()*3);
              student.attributes.eq = Math.min(100, student.attributes.eq + 1);
              msg = `你和 ${npc.name} 闲聊，气氛愉快。好感 +${delta}，情商 +1。`;
              break;
            case 'study':
              delta = 3;
              student.attributes.memory = Math.min(100, student.attributes.memory + 1);
              msg = `你和 ${npc.name} 一起学习。好感 +${delta}，记忆 +1。`;
              break;
            case 'tease':
              delta = -(2 + Math.floor(Math.random()*3));
              msg = `你和 ${npc.name} 打趣过头了……好感 ${delta}。`;
              break;
          }

          const newFavor = Math.max(0, Math.min(100, getFavor(npc) + delta));
          setFavor(npc, newFavor);
          markInteractThisQuarter(id, action);
          openWeChatPanel();
          showReport(`🟢 微信 · ${msg}`);
          renderAttributes();
        }


        function openGiftSelectModal(npcId){
          // 关微信/其它面板遮罩（可选）
          if (typeof closeOtherPanel === 'function') closeOtherPanel();

          const modal = document.getElementById('gift-modal');
          if (!modal) return;
          if (modal.parentElement !== document.body) document.body.appendChild(modal);

          // 关键 overlay 样式兜底
          Object.assign(modal.style, {
            display:'flex', position:'fixed', inset:'0',
            background:'rgba(0,0,0,.7)', zIndex:'20020',
            alignItems:'center', justifyContent:'center'
          });

          // 从背包中收集礼物
          const inv = student.inventory || {};
          const entries = Object.entries(inv)
            .filter(([id, count]) => count > 0)
            .map(([id, count]) => {
              const item = (SHOP_DB || []).find(x => x.id === id);
              return item && item.cat === 'gift' ? { ...item, count } : null;
            }).filter(Boolean);

          const listEl = document.getElementById('gift-list');
          const emptyEl = document.getElementById('gift-empty');

          if (!entries.length){
            listEl.innerHTML = '';
            emptyEl.style.display = 'block';
          } else {
            emptyEl.style.display = 'none';
            listEl.innerHTML = entries.map(it => `
              <div class="gift-card">
                <div class="gift-thumb">
                  ${it.img ? `<img src="${it.img}" alt="${it.name}" onerror="this.style.display='none'">`
                            : `<span style="font-size:12px;color:#999">No Image</span>`}
                </div>
                <div class="gift-name">${it.name}</div>
                <div class="gift-desc">${it.desc || ''}</div>
                <div class="gift-meta">
                  <span>库存：${it.count}</span>
                  <span>🎯 好感+${predictGiftFavor(it, npcId)}</span>
                </div>
                <button class="gift-send" onclick="confirmSendGift('${npcId}', '${it.id}')">送出</button>
              </div>
            `).join('');
          }

          // 点击遮罩关闭（只绑一次）
          if (!modal.__bindBackdropOnce) {
            modal.addEventListener('click', (e)=>{ if (e.target === modal) closeGiftModal(); });
            modal.__bindBackdropOnce = true;
          }
        }
        function closeGiftModal(){
          const m = document.getElementById('gift-modal');
          if (m) m.style.display = 'none';
        }


        // 计算礼物的好感加成：优先用物品自带 favor，没有就按价钱/稀有度估算
        function giftFavorDelta(item, npc){
          if (typeof item.favor === 'number') return item.favor; // 例如玫瑰=8，巧克力=5
          // 兜底估算：价格越高、加成略高（可按需调整）
          const price = item.price || 10;
          const base = Math.min(12, Math.max(3, Math.round(price / 20) + 3)); // 3~12
          // 也可以根据 npc.role 做加成：恋人+2，导师+1 等（可选）
          if (npc.role && /恋人|初恋/.test(npc.role)) return base + 2;
          return base;
        }

        // 用于列表上展示预测值（不修改状态）
        function predictGiftFavor(item, npcId){
          const npc = NPC_DB.find(n=>n.id===npcId);
          return giftFavorDelta(item, npc || {});
        }

        function confirmSendGift(npcId, itemId){
          const npc = NPC_DB.find(n => n.id === npcId);
          if (!npc) return;

          // 背包校验
          if (!student.inventory || !student.inventory[itemId] || student.inventory[itemId] <= 0){
            alert('背包里没有这个礼物了。');
            return;
          }
          const item = (SHOP_DB || []).find(x => x.id === itemId);
          if (!item || item.cat !== 'gift'){
            alert('该物品不能作为礼物。');
            return;
          }

          // 扣 1 个库存
          student.inventory[itemId] -= 1;
          if (student.inventory[itemId] <= 0) delete student.inventory[itemId];

          // 计算好感增量
          const delta = giftFavorDelta(item, npc);
          const newFavor = Math.max(0, Math.min(100, getFavor(npc) + delta));
          setFavor(npc, newFavor);

          // 标记本季度对该 NPC 的“gift”已用
          markInteractThisQuarter(npcId, 'gift');

          // UI 刷新 & 反馈
          closeGiftModal();
          openWeChatPanel();        // 重新渲染微信面板（更新好感/按钮禁用状态）
          showReport(`🎁 你向 ${npc.name} 送出了 ${item.name}，好感 +${delta}。`);
          renderAttributes();
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
          alert(`🎮 打游戏放松了一会儿，心情 +${gain}。`);
          showReport(`🎮 打游戏放松了一会儿，心情 +${gain}。`);
          renderAttributes();
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
          alert(`🌳 公园散步，身心舒畅。健康 +${gain}，心情 +${gain}。`);
          showReport(`🌳 公园散步，身心舒畅。健康 +${gain}，心情 +${gain}。`);
          renderAttributes();
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
          alert(`📺 追剧小憩，心情 +${gain}。`);
          showReport(`📺 追剧小憩，心情 +${gain}。`);
          renderAttributes();
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
          alert(`💖 和恋人 ${npc.name} 一起约会了：好感 +${gainFavor}，心情 +${gainHappy}。`);
          showReport(`💖 和恋人 ${npc.name} 一起约会了：好感 +${gainFavor}，心情 +${gainHappy}。`);

          // 8) 若你有“微信联系人弹窗”在开着，刷新一下列表显示最新好感
          const wechatModal = document.getElementById('wechat-modal');
          if (wechatModal && wechatModal.style.display === 'flex') {
            openWeChatPanel(); // 复用渲染函数刷新

          renderAttributes();
          }
        }




        // 打开“其他行动”弹窗
        function openOtherPanel() {
          const modal = document.getElementById('other-modal');
          const box   = document.getElementById('other-actions-box');
          if (!modal || !box) return;

          // 这里添加按钮（按需扩展）
          box.innerHTML = `
            <button class="panel-btn" onclick="openShop()">🛒 商店 - 校门口的超市</button>
            <button class="panel-btn" onclick="openInventory()">🎒 查看背包</button>
            <!-- 后续可以继续加：
            <button class="panel-btn" onclick="openSettings()">⚙️ 设置</button>
            <button class="panel-btn" onclick="openAchievements()">🏆 成就</button>
            -->
          `;

          modal.style.display = 'flex';

          // 点击遮罩关闭
          modal.addEventListener('click', otherBackdropCloseOnce);
          // ESC 关闭（只绑定一次）
          if (!window.__otherEscBound) {
            window.__otherEscBound = true;
            window.addEventListener('keydown', (e)=>{
              if (e.key === 'Escape') closeOtherPanel();
            });
          }
        }

        function otherBackdropCloseOnce(e){
          if (e.target && e.target.id === 'other-modal') {
            closeOtherPanel();
          }
          // 只处理一次点击关闭，避免重复绑定叠加
          e.currentTarget.removeEventListener('click', otherBackdropCloseOnce);
        }

        function closeOtherPanel(){
          const modal = document.getElementById('other-modal');
          if (modal) modal.style.display = 'none';
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
            const subjectsToShow = student.Highschool_Arts_and_Sciences === "文科" 
                ? [ "math", "chinese", "english","politics", "history", "geography"]
                : [ "math", "chinese", "english","physics", "chemistry", "biology"];
            
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
          console.log(student.major);
          console.log(student.Highschool_Arts_and_Sciences);
          const subjectsToShow = student.Highschool_Arts_and_Sciences === "文科"
            ? ["math", "chinese", "english","politics", "history", "geography"]
            : ["math", "chinese", "english","physics", "chemistry", "biology"];

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




        function openShop(defaultCat = "gift") {
          // 关“其他行动”，避免遮罩盖住
          if (typeof closeOtherPanel === 'function') closeOtherPanel();

          let m = document.getElementById('shop-modal');
          if (!m) {
            // 没 DOM 就注入一份（可省略，如果你已写在 HTML 里）
            document.body.insertAdjacentHTML('beforeend', `
              <div id="shop-modal" style="display:none;">
                <div class="shop-content">
                  <span class="close-modal" onclick="closeShop()">&times;</span>
                  <h2>🛒 商店 · 校门口的超市</h2>
                  <div class="shop-balance">余额：<strong id="shop-cash">¥0</strong></div>
                  <div class="shop-tabs" id="shop-tabs"></div>
                  <div class="shop-grid" id="shop-list"></div>
                </div>
              </div>
            `);
            m = document.getElementById('shop-modal');
          }

          // 确保挂在 body 顶层（别放在其它弹窗内部）
          if (m.parentElement !== document.body) document.body.appendChild(m);

          // 关键样式（即使 CSS 被别的规则覆盖，这里也能兜底）
          Object.assign(m.style, {
            display: 'flex',
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,.7)',
            zIndex: '20000',
            alignItems: 'center',
            justifyContent: 'center'
          });

          // 渲染内容
          if (typeof renderShopTabs === 'function') renderShopTabs(defaultCat);
          if (typeof renderShopList === 'function') renderShopList(defaultCat);
          if (typeof updateShopCash === 'function') updateShopCash();

          // 点击遮罩关闭（仅绑定一次）
          if (!m.__bindBackdropOnce) {
            m.addEventListener('click', (e) => { if (e.target === m) closeShop(); });
            m.__bindBackdropOnce = true;
          }
        }

        function closeShop(){ const m = document.getElementById('shop-modal'); if (m) m.style.display = 'none'; }


        function updateShopCash(){
          const cashEl = document.getElementById('shop-cash');
          if (cashEl) cashEl.textContent = `¥${(student.cash || 0).toFixed(2)}`;
        }

        function renderShopTabs(activeKey) {
          const tabsEl = document.getElementById('shop-tabs');
          if (!tabsEl) return;
          tabsEl.innerHTML = SHOP_CATEGORIES.map(c => 
            `<button class="shop-tab ${c.key===activeKey?'active':''}" onclick="renderShopList('${c.key}')">${c.name}</button>`
          ).join('');
        }

        function renderShopList(catKey) {
          // 高亮当前 tab
          const tabsEl = document.getElementById('shop-tabs');
          if (tabsEl) {
            Array.from(tabsEl.children).forEach(btn => {
              btn.classList.toggle('active', btn.textContent.trim() === (SHOP_CATEGORIES.find(c=>c.key===catKey)?.name || ''));
            });
          }

          const listEl = document.getElementById('shop-list');
          if (!listEl) return;

          const items = SHOP_DB.filter(x => x.cat === catKey);

          listEl.innerHTML = items.map(item => {
            const soldout = item.stockLeft <= 0;
            const afford  = (student.cash || 0) >= item.price;
            const disabled = soldout || !afford;
            const stockStr = `${item.stockLeft}/${item.stockTotal}`;

            return `
              <div class="shop-card ${soldout ? 'soldout' : ''}">
                <div class="shop-thumb">
                  ${item.img ? `<img src="${item.img}" alt="${item.name}" onerror="this.style.display='none'">` : '<span style="font-size:12px;color:#999">No Image</span>'}
                </div>
                <div class="shop-name">${item.name}</div>
                <div class="shop-desc">${item.desc}</div>
                <div class="shop-meta">
                  <div class="shop-price">¥${item.price}</div>
                  <div class="shop-stock">库存：${stockStr}</div>
                </div>
                <button class="shop-buy-btn" ${disabled ? 'disabled' : ''} onclick="buyItem('${item.id}')">
                  ${soldout ? '已售罄' : (afford ? '购买' : '余额不足')}
                </button>
              </div>
            `;
          }).join('');
        }
        function buyItem(id) {
          const item = SHOP_DB.find(x => x.id === id);
          if (!item) return;
          if (item.stockLeft <= 0) {
            alert("该商品已售罄。");
            return;
          }
          if ((student.cash || 0) < item.price) {
            alert("余额不足。");
            return;
          }

          // 扣钱、减库存
          student.cash = (student.cash || 0) - item.price;
          item.stockLeft -= 1;

          // 入背包
          if (!student.inventory) student.inventory = {};
          student.inventory[id] = (student.inventory[id] || 0) + 1;

          // 购买反馈（你可以加不同物品的效果）
          showReport(`🛒 购买「${item.name}」成功，花费 ¥${item.price}。`);
          // 示例：物品效果（可按 id 分支）
          applyItemEffect(item);

          // 刷新 UI
          updateShopCash();
          // 重新渲染当前分类
          renderShopList(item.cat);
        }

        // 物品使用效果（可按 id 自行扩展）
        function applyItemEffect(item) {
          switch (item.id) {
            case "daily_water":
              student.attributes.health = Math.min(100, student.attributes.health + 2);
              showReport("💧 健康 +2");
              break;
            case "daily_bread":
              student.attributes.happy = Math.min(100, student.attributes.happy + 3);
              showReport("🥖 心情 +3");
              break;
            case "med_vit":
              student.attributes.health = Math.min(100, student.attributes.health + 5);
              showReport("💊 健康 +5");
              break;
            case "study_pen":
              // 可设置一个临时加成标记，或直接属性微增
              student.attributes.memory = Math.min(100, student.attributes.memory + 1);
              showReport("🖊️ 记忆 +1");
              break;
            case "event_ticket":
              // 设置一个标志，后续事件里识别，比如特殊看剧
              student.flags = student.flags || {};
              student.flags.hasShowTicket = true;
              showReport("🎫 获得『校园演出门票』，可触发特殊看剧事件。");
              break;
            case "event_giftbox":
              // 随机小事件（示例）
              const r = Math.random();
              if (r < 0.5) {
                student.attributes.luck = Math.min(100, (student.attributes.luck||50) + 5);
                showReport("🎁 打开神秘礼盒，好运 +5！");
              } else {
                student.attributes.happy = Math.max(0, student.attributes.happy - 3);
                showReport("🎁 礼盒里是学习资料…心情 -3（但可能有用？）");
              }
              break;
            default:
              break;
          }
        }

        // 小工具：用 id 找物品信息
        function getShopItemById(id){
          return (SHOP_DB || []).find(x => x.id === id) || null;
        }

        function openInventory(defaultCat = "all"){
          // 关“其他行动”以免遮罩挡住（可要可不要）
          if (typeof closeOtherPanel === 'function') closeOtherPanel();

          let m = document.getElementById('inventory-modal');
          if (!m) {
            // 没有就注入一个标准模板（如果你已在 HTML 里写好了，这段不会执行）
            document.body.insertAdjacentHTML('beforeend', `
              <div id="inventory-modal" style="display:none;">
                <div class="inv-content">
                  <span class="close-modal" onclick="closeInventory()">&times;</span>
                  <h2>🎒 我的背包</h2>
                  <div class="inv-summary">
                    物品种类：<strong id="inv-kinds">0</strong>，
                    总数量：<strong id="inv-total">0</strong>
                  </div>
                  <div class="inv-tabs" id="inv-tabs"></div>
                  <div class="inv-grid" id="inv-list"></div>
                  <div class="inv-empty" id="inv-empty" style="display:none;">
                    背包空空如也，去<span class="inv-link" onclick="openShop()">商店</span>逛逛吧～
                  </div>
                </div>
              </div>
            `);
            m = document.getElementById('inventory-modal');
          }

          // 确保在 body 顶层（不要挂在其它弹窗内部）
          if (m.parentElement !== document.body) document.body.appendChild(m);

          // 关键样式兜底，防止被其它规则覆盖
          Object.assign(m.style, {
            display: 'flex',
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,.7)',
            zIndex: '20010',
            alignItems: 'center',
            justifyContent: 'center'
          });

          // 渲染内容
          if (typeof renderInventoryTabs === 'function') renderInventoryTabs(defaultCat);
          if (typeof renderInventoryList === 'function') renderInventoryList(defaultCat);

          // 点击遮罩关闭（只绑一次）
          if (!m.__bindBackdropOnce) {
            m.addEventListener('click', (e)=>{ if (e.target === m) closeInventory(); });
            m.__bindBackdropOnce = true;
          }

          // 调试输出（可删）
          const cs = getComputedStyle(m), r = m.getBoundingClientRect();
          console.log('[openInventory] display=', cs.display, 'pos=', cs.position, 'z=', cs.zIndex, 'size=', `${r.width}x${r.height}`);
        }

        function closeInventory(){
          const m = document.getElementById('inventory-modal');
          if (m) m.style.display = 'none';
        }

        function renderInventoryTabs(activeKey){
          const tabsEl = document.getElementById('inv-tabs');
          if (!tabsEl) return;

          // “全部”标签 + 其余分类
          const tabs = [{key:"all", name:"全部"}, ...INV_CATEGORIES];
          tabsEl.innerHTML = tabs.map(t => 
            `<button class="inv-tab ${t.key===activeKey?'active':''}" onclick="renderInventoryList('${t.key}')">${t.name}</button>`
          ).join('');
        }

        function renderInventoryList(catKey){
          const listEl = document.getElementById('inv-list');
          const emptyEl = document.getElementById('inv-empty');
          const kindsEl = document.getElementById('inv-kinds');
          const totalEl = document.getElementById('inv-total');
          if (!listEl) return;

          const inv = student.inventory || {};
          const entries = Object.entries(inv).filter(([,count]) => count > 0);

          // 汇总
          const totalCount = entries.reduce((s, [,c]) => s + c, 0);
          const kindsCount = entries.length;
          if (kindsEl) kindsEl.textContent = kindsCount;
          if (totalEl) totalEl.textContent = totalCount;

          if (entries.length === 0){
            listEl.innerHTML = "";
            if (emptyEl) emptyEl.style.display = "block";
            return;
          } else {
            if (emptyEl) emptyEl.style.display = "none";
          }

          const cards = entries
            .map(([id,count]) => {
              const base = getShopItemById(id);
              if (!base) return null;  // 未知物品（可选择隐藏）
              // 分类过滤
              if (catKey !== "all" && base.cat !== catKey) return null;

              const img = base.img ? `<img src="${base.img}" alt="${base.name}" onerror="this.style.display='none'">`
                                   : '<span style="font-size:12px;color:#999">No Image</span>';

              return `
                <div class="inv-card">
                  <div class="inv-thumb">${img}</div>
                  <div class="inv-name">${base.name}</div>
                  <div class="inv-desc">${base.desc || ""}</div>
                  <div class="inv-meta">
                    <div class="inv-cat">${(INV_CATEGORIES.find(c=>c.key===base.cat)?.name) || "其他"}</div>
                    <div class="inv-count">数量：${count}</div>
                  </div>
                </div>
              `;
            })
            .filter(Boolean);

          listEl.innerHTML = cards.length ? cards.join('') : '<div class="inv-empty">该分类暂无物品</div>';

          // 同步 Tabs 高亮
          const tabsEl = document.getElementById('inv-tabs');
          if (tabsEl){
            const labels = [{key:"all",name:"全部"}, ...INV_CATEGORIES];
            Array.from(tabsEl.children).forEach((btn, i) => {
              const isActive = labels[i].key === catKey;
              btn.classList.toggle('active', isActive);
            });
          }
        }




        console.log("加载了第三个函数文件，报告栏和行动栏js")
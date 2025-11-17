        // ===== 事件库 =====
        const gameEventsData = {
                "18-0": [
                { // 18岁春季固定事件
                    id: "first_exam",
                    title: "🏫第一次模拟考",
                    isImportant: true,
                    desc: "这是高三的第一次模拟考试,全校师生都非常重视。你坐在考场上,手心微微出汗...",
                    type: "exam",
                    options: [
                        {
                            text: "开始考试",
                            action: () => {
                                const total = takeExam();
                                student.attributes.happy -= 5;AdjustAttributes('happy');
                                student.attributes.health -= 3;AdjustAttributes('health');
                                student.lastExamScores = {...student.scores};
                                alert(`第一次模拟考结束！总分：${total}分`);
                                showReport(`💯第一次模拟考结束了，你总共拿了${total}分，心情和健康下降了一点。`);
                                student.completedEvents.first_exam = true;
                                closeEventModal();
                                renderEvents(false);
                                showScores("📊 高三第一次模拟考成绩");                                
                            }
                        }
                    ]
                },{
                    id: "first_exam_review",
                    title: "📐第一次模拟考复盘",
                    isImportant: true,
                    desc: "第一次模拟考的成绩出来了，你拿着成绩单，心里五味杂陈……",
                    type: "exam",
                    prerequisite: "first_exam",
                    options: [
                        {
                            text: "数学物理这方面还要再加强一些，多做点数学卷子吧！",
                            action: () => {
                                if (!student.completedEvents.first_exam) {
                                    alert("你需要先完成第一次模拟考！");
                                    return;
                                }
                                student.attributes.iq += 2;AdjustAttributes('iq');  
                                showReport(`在第一次模拟考结束后，你认真反思了成绩📑，着重加强了你的<strong>数学</strong>。现在你的<strong>智商</strong>上升了。`)
                                closeEventModal();
                                renderEvents(false);
                            }
                        },{
                            text: "语文和历史发挥失常了，要拿书再读一读想一想。",
                            action: () => {
                                if (!student.completedEvents.first_exam) {
                                    alert("你需要先完成第一次模拟考！");
                                    return;
                                }
                                student.attributes.eq += 2;AdjustAttributes('eq');
                                showReport(`在第一次模拟考结束后，你认真反思了成绩📑，着重加强了你的<strong>语文</strong>。现在你的<strong>情商</strong>上升了。`)
                                closeEventModal();
                                renderEvents(false);
                            }
                        },{
                            text: "英语和政治没有考好呢，要赶紧再背一背。",
                            action: () => {
                                if (!student.completedEvents.first_exam) {
                                    alert("你需要先完成第一次模拟考！");
                                    return;
                                }
                                student.attributes.memory += 2;AdjustAttributes('memory');
                                showReport(`在第一次模拟考结束后，你认真反思了成绩📑，着重加强了你的<strong>英语</strong> 。现在你的<strong>记忆力</strong>上升了。`)
                                closeEventModal();
                                renderEvents(false);
                            }
                        },{
                            text: "无敌了，这分数，闭着眼睛都能考上好大学！",
                            action: () => {
                                if (!student.completedEvents.first_exam) {
                                    alert("你需要先完成第一次模拟考！");
                                    return;
                                }
                                if(Math.random<0.4){
                                  student.attributes.memory -= 3;AdjustAttributes('memory');
                                } else if(Math.random<0.4){
                                  student.attributes.iq -= 3;AdjustAttributes('iq');
                                } else{
                                  student.attributes.eq -= 3;AdjustAttributes('eq');
                                };
                                alert("没到最后一刻千万不要松懈。\n似乎有些东西在放松中遗忘了。");
                                showReport(`第一次模拟考考得很好，让你飘飘欲仙了，但是没到最后一刻千万不要松懈⚠，似乎有些东西在放松中遗忘了。`)
                                closeEventModal();
                                renderEvents(false);
                            }
                        }
                    ]
                          
                },{
                    id: "second_exam",
                    title: "🏫第二次模拟考",
                    isImportant: true,
                    desc: "第二次模拟考来了,这是高考前最后一次也是最重要的一次演练。",
                    type: "exam",
                    prerequisite: ["first_exam","first_exam_review"],
                    options: [
                        {
                            text: "开始考试",
                            action: () => {
                                if (!student.completedEvents.first_exam_review) {
                                    alert("你需要先完成第一次模拟考复盘！");
                                    return;
                                }
                                const total = takeExam();
                                student.attributes.happy -= 5;AdjustAttributes('happy');
                                student.attributes.health -= 3;AdjustAttributes('health');
                                alert(`第二次模拟考结束！总分：${total}分`);
                                showReport(`💯第二次模拟考结束了，你总共拿了${total}分。心情和健康下降了一点`)
                                student.completedEvents.second_exam = true;
                                closeEventModal();
                                renderEvents(false);
                                showScores("📊 高三第二次模拟考成绩"); 
                            }
                        }
                    ]
                          
                },{
                    id: "high_school_sport",
                    title: "👟高中最后一场运动会",
                    isImportant: false,
                    desc: "这是高中的最后一场运动会，似乎也是沉闷的高三生活中难得的喘息时间，你决定在这场运动会中……",
                    type: "sport",
                    prerequisite: "",
                    options: [
                            {
                                text: "报名参赛",
                                action: () => {          
                                    if (student.attributes.sport < (60+Math.random()*20)) {
                                      continueInModal({
                                          desc: "你拼尽了全力，但仍旧差一点，冠军与你无缘。最后一次参赛，还是留下了遗憾。",
                                          options: [
                                              {
                                                  text: "人生总是有遗憾的",
                                                  action: () => {
                                                      student.attributes.memory += 2;AdjustAttributes('memory');
                                                      student.attributes.happy -= 5;AdjustAttributes('happy');
                                                      closeEventModal();
                                                      showReport(`在高中的最后一场运动会，你选择报名参赛。\n 可惜没有取得好名次，人生总是有遗憾的吧🙁。`);
                                                  }
                                              },
                                              {
                                                  text: "这不是我的真正实力！",
                                                  action: () => {
                                                      student.attributes.eq -= 2;AdjustAttributes('eq');
                                                      student.attributes.happy -= 10;AdjustAttributes('happy');
                                                      alert("体育竞技，输赢乃兵家常事，你怎么破防呢你。");
                                                      closeEventModal();
                                                      showReport(`在高中的最后一场运动会，你选择报名参赛。\n 可惜没有取得好名次，你气急败坏，心情大幅下降😠。`);
                                                  }
                                              },{
                                                  text: "重在参与，开心是最重要的。",
                                                  action: () => {
                                                      student.attributes.happy += 5;AdjustAttributes('happy');
                                                      closeEventModal();
                                                      showReport(`在高中的最后一场运动会，你选择报名参赛。\n 可惜没有取得好名次，但你心态很好，重在参与嘛😛。`);
                                                  }
                                              }
                                          ]
                                      });
                                  } else {
                                      continueInModal({
                                          desc: "你闭上眼睛冲刺，冲线的那一刻，耳边响起了欢呼声。\n 你赢了，你带领着你的班级赢得了荣誉！",
                                          options: [
                                              {
                                                  text: "又一件珍贵的回忆，让你的头脑更加清醒了。",
                                                  action: () => {
                                                      student.attributes.iq += 1;AdjustAttributes('iq');
                                                      student.attributes.memory += 2;AdjustAttributes('memory');
                                                      student.attributes.happy += 10;AdjustAttributes('happy');
                                                      showReport(`在高中的最后一场运动会，你选择报名参赛。\n <strong>你夺冠了！</strong>🥇又一件珍贵的回忆，让你的<strong>智商，记忆力和心情</strong>提升了`);
                                                      closeEventModal();
                                                  }
                                              }
                                          ]
                                      });
                                  }
                                }
                            },
                            {
                                text: "放松休息，大吃特吃",
                                action: () => {
                                    student.attributes.happy += 5;AdjustAttributes('happy');
                                    student.attributes.sport -= 5;AdjustAttributes('sport');
                                    student.attributes.charm -= 2;AdjustAttributes('charm');
                                    student.attributes.health -= 2;AdjustAttributes('health');
                                    showReport(`在高中的最后一场运动会，你选择放松休息，大吃特吃。 你吃的很开心！但是吃太多对身体可不好。<strong>心情</strong>有所上升，<strong>运动、魅力和健康</strong>有所下降。`);
                                    closeEventModal();
                                }
                            },
                            {
                                text: "偷偷学习，卷！",
                                action: () => {
                                    student.attributes.iq += 5;AdjustAttributes('iq');
                                    student.attributes.luck -= 5;AdjustAttributes('luck');
                                    alert("好好好，在这卷我们是吧，反内卷之神会惩罚你的，你后面会倒霉的！");
                                    showReport(`在高中的最后一场运动会，你选择偷偷学习。 你的<strong>智商</strong>提升了，但不知道为什么，你的<strong>运气</strong>下降了 `);
                                    closeEventModal();
                                }
                            }
                    ]
                          
                }],
                "18-1": [
                    {
                    id: "second_exam_review",
                    title: "📐第二次模拟考复盘",
                    isImportant: true,
                    desc: "在酷暑中，你一边用书本扇着风，一边听着老师讲着第二次模拟考的卷子，这次考试……",
                    type: "exam",
                    prerequisite: ["first_exam","first_exam_review","second_exam"],
                    options: [
                        {
                            text: "数学考的还是不够好，今晚突击刷两套卷子吧",
                            action: () => {
                                student.attributes.iq += 3;AdjustAttributes('iq');
                                showReport(`在第二次模拟考结束后，你认真反思了成绩📑，着重加强了你的<strong>数学</strong> 。现在你的<strong>智商</strong>上升了。`);
                                closeEventModal();
                                renderEvents(false);
                            }
                        },{
                            text: "语文分数拖了后腿，赶紧把古诗文再看一次吧。",
                            action: () => {
                                student.attributes.eq += 3;AdjustAttributes('eq');
                                showReport(`在第二次模拟考结束后，你认真反思了成绩📑，着重加强了你的<strong>语文</strong> 。现在你的<strong>情商</strong>上升了。`);
                                closeEventModal();
                                renderEvents(false);
                            }
                        },{
                            text: "英语单词不会的太多了，抓紧再背一背吧。",
                            action: () => {
                                student.attributes.memory += 3;AdjustAttributes('memory');
                                showReport(`在第二次模拟考结束后，你认真反思了成绩📑，着重加强了你的<strong>英语</strong> 。现在你的<strong>记忆力</strong>上升了。`);
                                closeEventModal();
                                renderEvents(false);
                            }
                        },{
                            text: "考的非常的好，完全无心听老师的讲课。",
                            action: () => {
                                if (!student.completedEvents.second_exam) {
                                    alert("你需要先完成第二次模拟考！");
                                    return;
                                }
                                if(Math.random<0.4){
                                  student.attributes.memory -= 1;AdjustAttributes('memory');
                                  showReport(`在第二次模拟考结束后，你在复盘课程中溜号了😦，现在你的<strong>记忆力</strong>下降了一点。`);
                                } else if(Math.random<0.4){
                                  student.attributes.iq -= 1;AdjustAttributes('iq');
                                  showReport(`在第二次模拟考结束后，你在复盘课程中溜号了😦，现在你的<strong>智商</strong>下降了一点。`);
                                } else{
                                  student.attributes.eq -= 1;AdjustAttributes('eq');
                                  showReport(`在第二次模拟考结束后，你在复盘课程中溜号了😦，现在你的<strong>情商</strong>下降了一点。`);
                                };
                                alert("高考前，每一次溜号，都有一定概率错过某个考试的要点。\n这次溜号会错过什么吗？你不知道，因为你已经溜号了。");
                                closeEventModal();
                                renderEvents(false);
                            }
                        }
                    ]
                          
                },{
                    id: "College_Entrance_examination",
                    title: "📚 人生大考",
                    isImportant: true,
                    desc: "六月，在蝉鸣中你还是迎来了高考，寒窗苦读十二年就是为了今天，这场考试将是你人生的分水岭……",
                    type: "exam",
                    prerequisite: ["first_exam","second_exam","first_exam_review","second_exam_review"],
                    options: [
                        {
                            text: "开始考试",
                            action: () => {
                                student.attributes.happy += 5;AdjustAttributes('happy');
                                student.attributes.health -= 3;AdjustAttributes('health');
                                showReport(`😆你的高考结束了，现在终于可以放肆地玩了。等到月底再来查成绩吧！<strong>心情</strong>提升了一点，<strong>健康</strong>下降了一点。`);
                                student.completedEvents.College_Entrance_examination = true;
                                closeEventModal();
                                renderEvents(false);
                                //showScores(); 
                            }
                        }
                    ]
                },{
                    id: "High_school_graduation_ceremony",
                    title: "🎓️ 毕业典礼",
                    isImportant: true,
                    desc: "三年的高中生活结束了，在最后的毕业典礼上，你想……",
                    type: "choice",
                    prerequisite: ["first_exam","second_exam","first_exam_review","second_exam_review"],
                    options: [
                            {
                                text: "👨‍🏫对老师表示感谢",
                                action: () => {
                                    student.attributes.eq += 2;AdjustAttributes('eq');
                                    student.completedEvents.High_school_graduation_ceremony = true;
                                    showReport(`🎓️在高中最后的毕业典礼上，你向各位老师表示了感谢，向他们献出了花束。现在你的<strong>情商</strong>提高了一点。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            },
                            {
                                text: "👨‍🎓和同学们合影拍照",
                                action: () => {
                                    student.attributes.memory += 2;AdjustAttributes('memory');
                                    student.attributes.happy += 5;AdjustAttributes('happy');
                                    student.completedEvents.High_school_graduation_ceremony = true;
                                    showReport(`🎓️在高中最后的毕业典礼上，你和同学们在校园各处合影拍照，留下回忆。现在你的<strong>记忆力和心情</strong>提高了一点。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            },
                            {
                                text: "💄为了毕业照精心打扮",
                                action: () => {
                                    student.attributes.charm += 2;AdjustAttributes('charm');
                                    student.completedEvents.High_school_graduation_ceremony = true;
                                    showReport(`🎓️在高中最后的毕业典礼上，你精心打扮了一番，在毕业照上留下了你最美的青春样子。现在你的<strong>魅力</strong>提高了一点。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            },
                            {
                                text: "👨‍👩‍👦邀请父母来学校转转",
                                action: () => {
                                    student.attributes.eq += 1;AdjustAttributes('eq');
                                    student.attributes.happy += 5;AdjustAttributes('happy');
                                    student.completedEvents.High_school_graduation_ceremony = true;
                                    showReport(`🎓️在高中最后的毕业典礼上，你邀请父母来学校参观，一起见证你的毕业。现在你的<strong>情商和心情</strong>提高了一点。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            },
                            {
                                text: "⛹️‍不参加毕业典礼，自己跑出去玩",
                                action: () => {
                                    student.attributes.sport += 2;AdjustAttributes('sport');
                                    student.attributes.happy += 2;AdjustAttributes('happy');
                                    student.attributes.memory += 2;AdjustAttributes('memory');
                                    student.completedEvents.High_school_graduation_ceremony = true;
                                    showReport(`🎓️你并没参加高中最后的毕业典礼，跑出去玩让你开心很多，但是有些共同记忆你不再拥有。现在你的<strong>运动和心情</strong>提高了一点，<strong>记忆力</strong>降低了一点。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            }
                    ]
                },{
                      id: "College_entrance_examination_score_checking",
                      title: "📚 高考查分与志愿填报",
                      isImportant: true,
                      desc: "不知不觉，高考出分的日子就要到了，全家人一起坐在电脑前，紧张地看着一遍一遍刷新的网页……",
                      type: "exam",
                      prerequisite: [
                        "first_exam","second_exam","first_exam_review",
                        "second_exam_review","College_Entrance_examination","High_school_graduation_ceremony"
                      ],
                      options: [
                        {
                          text: "高考成绩刷新出来了！",
                          action: () => {
                            // 1) 出分（只计算一次）
                            if (student.gaokaoScore == null) {
                              const total = takeExam();
                              student.gaokaoScore = total;
                              student.lastExamScores = { ...student.scores };
                              // showScores();
                              alert(`💯 高考成绩出来了，${student.name} 考了 ${total} 分。`)
                              showReport(`💯 高考成绩出来了，${student.name} 的高考分数是<strong> ${total} 分</strong>。`);
                            }
                            const college_preference = getChoicesByScore(student.gaokaoScore);

                            // 2) 顺序概率录取（0.3 冲刺 → 0.7 求稳 → 保底）
                            const result = simulateAdmissionSequential(student.gaokaoScore);

                            // 3) 保存最终结果并收尾
                            student.university = result.university;
                            student.completedEvents.College_entrance_examination_score_checking = true;

                            if (result.university) {
                              showReport(`✅ 志愿提交成功：<strong>${result.tier}录取 → ${result.university}</strong>`);
                              alert(`结果公布：你被 ${result.university} 录取（${result.tier}）`);
                            } else {
                              showReport(`⚠️ 没有匹配到学校，请检查数据库或分数区间配置。`);
                              alert(`没有匹配到学校，可能是数据库为空。`);
                            }

                            // 3) 按文/理随机给 5 个专业，供玩家选择
                            const stream = student.major; // "文科" or "理科"
                            const majors = getRandomMajorsByStream(stream, 5);

                            continueInModal({
                              desc:
                                `🎉 结果公布：你被 ${result.university} 录取（${result.tier}）。\n\n` +
                                `请在以下 5 个${stream}专业中选择你的入学专业：\n` +
                                majors.map((m, i) => ` ${i + 1}. ${m}`).join("\n"),
                              options: majors.map((m) => ({
                                text: m,
                                action: () => {
                                  student.major = m; // ✅ 保存最终专业
                                  student.completedEvents.College_entrance_examination_score_checking = true;
                                  showReport(`你反复查询网站，确认了那句 “✅考生${student.name} 已被录取至我校专业：<strong>${student.major}</strong>,请于今年九月来我校报道。 <strong>${student.university}</strong>”`);
                                  
                                  closeEventModal();showScores("📊🎓️ 高考成绩");
                                  renderEvents(false);
                                  student.completedEvents.College_entrance_examination_score_checking =true;
                                      }
                              }))
                            });
                          }
                        }
                      ]
                    }],
                "18-2": [
                        {
                          id: "university_intro",
                          title: "🏫 大学报道",
                          isImportant: true,
                          desc: `父母陪着你来到了校门口，看着来来往往的新面孔，你走进了校园……`,
                          type: "choice",
                          prerequisite: [],
                          multiStep: true,
                          subtasks: ["checkin","explore","welcome"], 
                          options: [
                            { key:"checkin", text:"🏘先去办理入住吧！",
                              action: () => {
                                    if(!student.roommate){student.roommate = 1;}
                                    addItemToInventory("dorm_key", 1, { source: "报道入住" });
                                    alert("🏘 已办理宿舍入住。获取了物品-宿舍钥匙*1，可以在背包查看; 认识了新的室友，可以在微信中查看。");
                                    showReport("🏘 已办理宿舍入住。获取了<strong>物品-宿舍钥匙*1</strong>，; <strong>认识了新的室友</strong>，可以在微信中查看。");  
                                }
                            },
                            { key:"explore", text:"🏪先在新校园里逛一逛吧！",
                              action: () => {
                                    alert("🏪 在学校里逛了一圈，对学校有了大概的了解。");
                                    showReport("🏪 在学校里逛了一圈，对学校有了大概的了解。"); 
                                }
                            },
                            { key:"welcome", text:"🏟先去迎新点办好迎新的事儿吧！",
                              action: () => { 
                                    addItemToInventory("campus_card", 1, { source: "迎新发放" });
                                    alert("🏟 完成迎新流程，获取了物品-校园卡*1，可以在背包查看。");
                                    showReport(`🏟 完成迎新流程，获取了<strong>物品-校园卡*1</strong>，可以在背包查看。`);
                                }
                            }
                          ]
                        },
                        {
                            id: "Admission_physical_examination_univeristiy",
                            title: "👨‍⚕️ 新生入学体检",
                            isImportant: true,
                            desc: "在报道结束后没几天，新生入学体检就开始了，你们在校医院排着队……",
                            type: "choice",
                            prerequisite: ["university_intro"],
                            options: [
                                {
                                    text: "开始体检",
                                    action: () => {
                                        if(student.attributes.health>=80){
                                            alert(`🩺你的身体素质特别好，医生拍了拍你的肩膀，让你继续保持！`);
                                            showReport(`🩺体检结束了，你的身体素质特别好，医生拍了拍你的肩膀，让你继续保持！<strong>目前健康值为${student.attributes.health}</strong>。`);
                                        }else if(student.attributes.health>=60){
                                            alert(`🩺你的身体最近似乎有点差，医生说最近要吃的健康一点，注意多运动！`);
                                            showReport(`🩺体检结束了，你的身体最近似乎有点差，医生说最近要吃的健康一点，注意多运动！<strong>目前健康值为${student.attributes.health}</strong>。`);
                                        }else{
                                            alert(`🩺医生皱了皱眉头，警告你一定要少熬夜，你的身体素质比同龄人的似乎差很多。`);
                                            showReport(`🩺体检结束了，医生警告你一定要少熬夜，你的身体素质比同龄人的似乎差很多。<strong>目前健康值为${student.attributes.health}</strong>。`);
                                        }
                                        student.completedEvents.Admission_physical_examination_univeristiy = true;
                                        closeEventModal();
                                        renderEvents(false);
                                    }
                                }
                            ]
                        },{
                            id: "Course_selection_1",
                            title: "📖 第一学期选课",
                            isImportant: true,
                            desc: "你打开选课系统，看着上面一直不停转动的加载图标，急得不断刷新……",
                            type: "choice",
                            prerequisite: ["university_intro","Admission_physical_examination_univeristiy"],
                            options: [
                                {
                                    text: "点击开始选课",
                                    action: () => {
                                        alert(`📖你选了几门课，没想到 ${student.major}专业 有这么多课要上。`);
                                        showReport(`📖你选了几门课，没想到 ${student.major}专业 有这么多课要上。`);
                                        student.completedEvents.Course_selection_1 = true;
                                        closeEventModal();
                                        renderEvents(false);
                                    }
                                }
                            ]
                        },{
                            id: "Welcome_party",
                            title: "🎟 迎新晚会和中秋晚会",
                            isImportant: true,
                            desc: "大学的时光飞逝，忙忙碌碌中已经来到了九月底，学院组织新生召开了迎新和中秋晚会……",
                            type: "choice",
                            prerequisite: ["university_intro","Admission_physical_examination_univeristiy","Course_selection_1"],
                            options: [
                                {
                                    text: "🍿喜欢这种活动，拉着朋友看了全程",
                                    action: () => {
                                        student.attributes.happy += 3;AdjustAttributes('happy');
                                        student.attributes.memory += 2;AdjustAttributes('memory');
                                        alert(`🍿演出很有意思，你和朋友开心的看完了全程，心情和记忆力提升了一点。`);
                                        showReport(`🍿演出很有意思，你和朋友开心的看完了全程，<strong>心情和记忆力</strong>提升了一点。`);
                                        student.completedEvents.Welcome_party = true;
                                        closeEventModal();
                                        renderEvents(false);
                                    }
                                },{
                                    text: "🎤报名上台表演，展示一下自己的才艺",
                                    action: () => {
                                        if(Math.random()<0.75){
                                            student.attributes.happy += 3;AdjustAttributes('happy');
                                            student.attributes.charm += 4;AdjustAttributes('charm');
                                            alert(`🎤你的表演赢得了台下的阵阵喝彩，心情和魅力提升了一点。`);
                                            showReport(`🎤你的表演赢得了台下的阵阵喝彩，<strong>心情和魅力</strong>提升了一点。`); 
                                        }else{
                                            student.attributes.happy -= 10;AdjustAttributes('happy');
                                            student.attributes.charm -= 2;AdjustAttributes('charm');
                                            student.attributes.memory -= 1;AdjustAttributes('memory');
                                            alert(`🎤你的表演有点糟糕，台下观众面无表情，你紧张地走下了台。心情、魅力和记忆力下降了。`);
                                            showReport(`🎤你的表演有点糟糕，台下观众面无表情，你紧张地走下了台。<strong>心情、魅力和记忆力</strong>下降了。`); 
                                        }                                       
                                        student.completedEvents.Welcome_party = true;
                                        closeEventModal();
                                        renderEvents(false);
                                    }
                                },{
                                    text: "🛏对这种活动没什么兴趣，还是在宿舍呆着吧",
                                    action: () => {
                                        student.attributes.sport -= 2;AdjustAttributes('sport');
                                        student.attributes.health -= 2;AdjustAttributes('health');
                                        alert(`🛏你不愿意参加这些活动，但是总窝在宿舍可不好。运动和健康下降了一点。`);
                                        showReport(`🛏你不愿意参加这些活动，但是总窝在宿舍可不好。<strong>运动和健康</strong>下降了一点。`);
                                        student.completedEvents.Welcome_party = true;
                                        closeEventModal();
                                        renderEvents(false);
                                    }
                                }
                            ]
                        },],
                // 随机事件池
                "random_events": [ 
                    {
                        id: "puppy_love",                        
                        title: "💘学校三令五申不许早恋",
                        isImportant: false,
                        desc: "班里转来了一位复读的同学,你们被安排成了同桌,ta经常向你请教问题,随着每天的聊天,你们的感情似乎暧昧了起来。渐渐地你每天总是期盼着能见到ta,看见ta就会开心,你这是怎么了？",
                        type: "choice",
                        availableSeasons: ["18-0", "18-1"],   // 可以出现的回合
                        repeatable: false,                    // true = 可重复；false = 全局一次
                        options: [
                            {
                              text: "表白心意",
                              action: () => {
                                  student.attributes.eq += 5;AdjustAttributes('eq');
                                  student.attributes.memory -= 3;AdjustAttributes('memory');
                          
                                  if (Math.random() < 0.6) {
                                      // ===== 失败分支 =====
                                      continueInModal({
                                          desc: "你鼓起勇气表白了！但是ta只是尴尬地笑了笑,说'我们还是做朋友吧'。虽然结果失败了,但你勇敢地迈出了这一步,至少你的青春是不留遗憾的。",
                                          options: [
                                              {
                                                  text: "💔你会心痛地emo？",
                                                  action: () => {
                                                      student.attributes.eq -= 10;AdjustAttributes('eq');
                                                      student.attributes.iq -= 5;AdjustAttributes('iq');
                                                      student.attributes.memory -= 5;AdjustAttributes('memory');
                                                      student.attributes.logic -= 3;AdjustAttributes('logic');
                                                      student.attributes.happy -= 20;AdjustAttributes('happy');
                                                      alert("果然最影响学习的不是恋爱,而是失恋。随着表白被拒绝,你浑浑噩噩地过了几天,当你惊醒时,发现距离高考已经没剩几天了。");
                                                      showReport(`💔你向ta表白了，但还是被拒绝了。唉，果然最影响学习的不是恋爱,而是失恋。随着表白被拒绝,你浑浑噩噩地过了几天,当你惊醒时,发现距离高考已经没剩几天了。`);
                                                      closeEventModal();
                                                      renderEvents(false);
                                                  }
                                              },
                                              {
                                                  text: "❤️‍🩹还是化悲痛为力量？",
                                                  action: () => {
                                                      student.attributes.eq -= 2;AdjustAttributes('eq');
                                                      student.attributes.iq += 2;AdjustAttributes('iq');
                                                      student.attributes.happy -= 10;AdjustAttributes('happy');
                                                      showReport(`❤️‍🩹你向ta表白了，但还是被拒绝了。还是学习吧，你跟ta说话说一百次，ta也不是你的，你看书看一百次，知识就是你的。`);
                                                      alert("学吧,太深了,学无止境啊,书中自有黄金屋,书中自有颜如玉。");
                                                      closeEventModal();
                                                      renderEvents(false);
                                                  }
                                              }
                                          ]
                                      });
                                  } else {
                                      // ===== 成功分支 =====
                                      continueInModal({
                                          desc: "ta点了点头,对你微笑着说ta也喜欢你。\n这就是初恋的感觉吗,来得有点太快,幸福冲昏了你的头脑。",
                                          options: [
                                              {
                                                  text: "💞幸福而青涩的校园初恋！",
                                                  action: () => {
                                                      student.attributes.eq += 5;AdjustAttributes('eq');
                                                      student.attributes.iq += 5;AdjustAttributes('iq');
                                                      student.attributes.memory -= 2;AdjustAttributes('memory');
                                                      student.attributes.happy += 20;AdjustAttributes('happy');
                                                      student.love = 1;
                                                      alert("美好的青春恋情啊,每天见到喜欢的人就足够了,多么简单而又幸福的愿望。\n可是学校老师和家长似乎不是这么想的。");
                                                      showReport(`💞你表白成功了！${student.name}你小子也是谈上恋爱了。<strong>现在恋爱相关事件(社交-约会，社交-微信-恋人)解锁了。</strong>`);
                                                      closeEventModal();
                                                      renderEvents(false);
                                                  }
                                              }
                                          ]
                                      });
                                  }
                              }
                          },
                            {
                                text: "纠结犹豫",
                                action: () => {
                                    student.attributes.iq -= 3;AdjustAttributes('iq');
                                    //alert("你在纠结中度过了一个月,感觉学习效率下降了。");
                                    showReport(`💙你在错误的时间喜欢上了一个人，纠结了很久也没有采取行动，现在你的<strong>智商</strong>下降了一点。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            },
                            {
                                text: "专心备考",
                                action: () => {
                                    student.attributes.memory += 5;AdjustAttributes('memory');
                                    //alert("心中无感情，下笔自然神！\n 脑子里没有了情情爱爱，记忆力似乎都好了！");
                                    showReport(`💭你在错误的时间喜欢上了一个人，但你的理智让你专注学习，心中无感情，下笔自然神！现在你的<strong>记忆力</strong>提高了一点。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            }
                        ]
                    },
                    {
                        id: "parent_fight",
                        title: "🏠 父母吵架",
                        isImportant: false,
                        desc: "最近父母经常因为琐事争吵,家里的气氛很压抑。你的心情也受到了影响...",
                        type: "choice",
                        availableSeasons: ["18-0", "18-1"],   // 可以出现的回合
                        repeatable: false,                    // true = 可重复；false = 全局一次                        
                        options: [
                            {
                                text: "劝劝父母，希望他们能互相理解。",
                                action: () => {
                                    if(Math.random<0.8){
                                      student.attributes.eq += 8;AdjustAttributes('eq');
                                      alert("你尝试调解,父母看在你的即将高考的份上妥协了，虽然效果有限,但情商大幅提升！");
                                      showReport(`🏠最近父母经常因为琐事争吵，你尝试调解,父母看在你的即将高考的份上妥协了。现在你的<strong>情商</strong>提升了。`);
                                    } else{
                                      student.attributes.eq -= 4;AdjustAttributes('eq');
                                      student.attributes.happy -= 4;AdjustAttributes('happy');
                                      alert("你的调节没什么用，你妈只会跟你说‘大人说话，小孩别插嘴！’");
                                      showReport(`🏠最近父母经常因为琐事争吵，你尝试调解,但是你的调节没什么用。现在你的<strong>情商和心情</strong>下降了。`);
                                    }                                                                
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            },
                            {
                                text: "他们吵就吵吧，也不是第一天了，烦死了。",
                                action: () => {
                                    student.attributes.memory += 1;AdjustAttributes('memory');
                                    student.attributes.iq += 1;AdjustAttributes('iq');
                                    student.attributes.happy -= 5;AdjustAttributes('happy');
                                    showReport(`🏠最近父母经常因为琐事争吵，你没有管他们，继续学习，心里有点烦躁。现在你的<strong>记忆力和智商</strong>提升了一点，<strong>心情</strong>下降了。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            }
                        ]
                    },
                    {
                        id: "study_burnout",
                        title: "😩 厌学情绪",
                        isImportant: false,
                        desc: "连续的高强度学习让你感到极度疲惫,看着书本就头疼...",
                        type: "choice",
                        availableSeasons: ["18-0", "18-1"],   // 可以出现的回合
                        repeatable: true,                    // true = 可重复；false = 全局一次                        
                        options: [
                            {
                                text: "休息放松一周",
                                action: () => {
                                    student.attributes.memory -= 5;AdjustAttributes('memory');
                                    student.attributes.eq += 3;AdjustAttributes('eq');
                                    showReport(`🤓最近连续的高强度学习让你感到极度疲惫,你选择休息放松一周。现在你的<strong>情商</strong>提升了，<strong>记忆力</strong>下降了。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            },
                            {
                                text: "咬牙坚持",
                                action: () => {
                                    student.attributes.engineering += 5;AdjustAttributes('engineering');
                                    student.attributes.health -= 10;AdjustAttributes('health');
                                    //alert("你坚持下来了！成绩有所提升，但是身体情况有点下降。");
                                    showReport(`🤓最近连续的高强度学习让你感到极度疲惫,你选择咬牙坚持。现在你的<strong>工程能力</strong>提升了，<strong>健康</strong>下降了。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            }
                        ]
                    },
                    {
                        id: "brain_medicine",
                        title: "💊 补脑药",
                        desc: "妈妈听说你学习辛苦,特意买了贵的补脑药,说能提高记忆力。你看着那瓶蓝色的药丸...",
                        type: "choice",
                        availableSeasons: ["18-0", "18-1"],   // 可以出现的回合
                        repeatable: false,                    // true = 可重复；false = 全局一次
                        options: [
                            {
                                text: "虽然不是很相信，但毕竟是妈妈的一片心意，吃掉吧",
                                action: () => {
                                  if (Math.random()<0.6){
                                    student.attributes.memory += 10;AdjustAttributes('memory');
                                    alert("你遵医嘱服药，发现这个药居然真的有效！");
                                    showReport(`💊妈妈听说你学习辛苦,特意买了贵的补脑药,说能提高记忆力。虽然不是很相信但还是吃掉了，发现这个药居然真的有效😮。现在你的<strong>记忆力</strong>提升了一点。`);
                                  } else{
                                    student.attributes.eq -=2;AdjustAttributes('eq');
                                    alert("吃了几天也没什么反应，你叹了口气，果然是骗人的。但是为了让妈妈开心，你还是跟她说很有效果。");
                                    showReport(`💊妈妈听说你学习辛苦,特意买了贵的补脑药,说能提高记忆力。虽然不是很相信但还是吃掉了，发现这个药居然果然是骗人的😥。现在你的<strong>情商</strong>下降了一点。`);
                                  }
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            },
                            {
                                text: "这种药可不能吃吧，万一对身体不好呢，偷偷扔掉吧",
                                action: () => {
                                    student.attributes.logic += 2;AdjustAttributes('logic');
                                    student.attributes.happy -=5;AdjustAttributes('happy');
                                    alert("你脑子转得很快，偷偷扔了药,但心里有些愧疚。");
                                    showReport(`💊妈妈听说你学习辛苦,特意买了贵的补脑药,说能提高记忆力。你认为这种都是骗人的，偷偷扔掉了药，心里有点愧疚😥。现在你的<strong>逻辑</strong>提升了一点，<strong>心情</strong>下降了。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            }
                        ]
                    },{
                        id: "go_to_run",
                        title: "🏃‍ 出去跑步",
                        desc: "跑步让人清醒，跑步让人健康，跑步让你遗忘烦恼，最近正好有空，要不要跑跑？",
                        type: "choice",
                        availableSeasons: ["18-0", "18-1","18-2","18-3"],   // 可以出现的回合
                        repeatable: true,                    // true = 可重复；false = 全局一次
                        options: [
                            {
                                text: "出去跑跑吧，对身体好",
                                action: () => {
                                  if (Math.random()<0.95){
                                    if(Math.random()<0.8){
                                      student.attributes.sport += 5;AdjustAttributes('sport');
                                      student.attributes.happy += 5;AdjustAttributes('happy');
                                      student.attributes.health += 5;AdjustAttributes('health');
                                      alert("跑步有好多好处，多跑跑步，让你身体变得更好。\n运动，心情，健康有所提升。");
                                      showReport(`🏃‍ 出去跑了跑步，现在你的<strong>运动，心情，健康</strong>提升了。`);
                                    }else{
                                      student.attributes.health -= 5;AdjustAttributes('health');
                                      student.attributes.sport -=5;AdjustAttributes('sport');
                                      alert("你迎着风奔跑，想象着跑步各种好处。但是当你崴脚伤到的时候，你才想起来跑步是一种剧烈运动，而你忘了热身。\n运动和健康有所下降。");
                                      showReport(`🏃‍ 出去跑了跑步，可是忘记热身崴脚了。现在你的<strong>运动和健康</strong>下降了。`);
                                    }
                                  } else{
                                    student.attributes.health +=5;AdjustAttributes('health');
                                    student.attributes.luck +=5;AdjustAttributes('luck');
                                    alert("随风奔跑，静下心来，就在拐角处，你看到了一个漂亮的女孩，她回头冲你笑了一下，你似乎得到了净化。\n🧚‍♀️神奇的好事发生了，好运增加了，健康提升了。");
                                    showReport(`🏃‍ 出去跑了跑步，🧚‍♀️突然遇到了很幸运的事情！现在你的<strong>健康和运气</strong>上升了。`);
                                  }
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            },
                            {
                                text: "不跑了，最近事情太多了，歇一歇吧",
                                action: () => {
                                    student.attributes.sport -= 3;AdjustAttributes('sport');
                                    alert("运动总是有时间的，希望下次，你能走出来运动运动吧！\n运动有一点下降。");
                                    showReport(`🏃‍ 本来想出去跑跑步，但是感觉事情太多了，还是没有去运动。现在你的<strong>运动</strong>下降了。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            }
                        ]
                    },{
                        id: "University_confusion",
                        title: "😵 大一的迷茫",
                        desc: "来到大学的第一年，各种琐事接踵而至，前路的迷茫让你一度感觉无所适从……",
                        type: "choice",
                        availableSeasons: ["18-2","18-3","19-1","19-2"],   // 可以出现的回合
                        repeatable: true,                    // true = 可重复；false = 全局一次
                        options: [
                            {
                                text: "👓向学长学姐请教吧",
                                action: () => {
                                  if (Math.random()<0.9){
                                    student.attributes.logic +=3;AdjustAttributes('logic');
                                    student.attributes.eq +=3;AdjustAttributes('eq');
                                    alert("👓学长学姐耐心地解答了你的问题，你感觉自己做事情更有信心了！现在你的情商和逻辑提升了一点。");
                                    showReport(`👓学长学姐耐心地解答了你的问题，你感觉自己做事情更有信心了！现在你的<strong>情商和逻辑</strong>提升了一点。`);
                                  } else{
                                    alert("😦你没找到可以询问的学长学姐，你的情况没什么变化。");
                                    showReport(`😦你没找到可以询问的学长学姐，你的情况没什么变化。`);
                                  }
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            },
                            {
                                text: "🏃出去运动散散心吧",
                                action: () => {
                                    student.attributes.sport += 3;AdjustAttributes('sport');
                                    student.attributes.happy += 3;AdjustAttributes('happy');
                                    alert("🏃出去运动运动，在汗水中你的压力减轻了不少，现在你的运动和心情提升了。");
                                    showReport(`🏃出去运动运动，在汗水中你的压力减轻了不少。现在你的<strong>运动和心情</strong>提升了。`);
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            },{
                                text: "✊相信自己的能力，你能解决的！",
                                action: () => {
                                    if (Math.random()<0.7){
                                    student.attributes.logic +=3;AdjustAttributes('logic');
                                    alert("✊相信自己的能力，你冷静分析，一件件解决了事情！现在你的逻辑提升了一点。");
                                    showReport(`✊相信自己的能力，你冷静分析，一件件解决了事情！现在你的<strong>逻辑</strong>提升了一点。`);
                                  } else{
                                    student.attributes.happy -=3;AdjustAttributes('happy');
                                    alert("😅在检查了很多遍之后，还是有事情被落下了。现在你的心情下降了一点。");
                                    showReport(`😅在检查了很多遍之后，还是有事情被落下了。现在你的<strong>心情</strong>下降了一点。`);
                                  }
                                    closeEventModal();
                                    renderEvents(false);
                                }
                            },
                        ]
                    }],

                "conditional_events": [
                    {
                        id: "lover_quarrel",
                        title: "💔 小争执",
                        desc: "备考压力下，你和恋人因为小事起了争执……",
                        isImportant: false,
                        repeatable: true,
                        availableSeasons: ["18-0","18-1","18-2","18-3"],
                        condition: (student) => !!student.love,   // ✅ 有恋爱关系才可能发生
                        prob: 0.4,                                // 60% 机率进入本季随机候选
                        options: [
                          {
                            text: "耐心沟通",
                            action: () => {
                              student.attributes.eq = Math.min(100, student.attributes.eq + 2);
                              showReport("💬 你们冷静沟通，情商 +2。");
                              closeEventModal();
                            }
                          },
                          {
                            text: "冷战几天",
                            action: () => {
                              student.attributes.happy = Math.max(0, student.attributes.happy - 5);
                              showReport("🥶 情绪受挫，心情 -5。");
                              closeEventModal();
                            }
                          }
                        ]
                      },],

                "threshold_events":[
                    {
                        id: "sick_low_health",
                        title: "🤒 身体不适",
                        desc: "你感到乏力头晕，或许是连日劳累……",
                        repeatable: true,
                        condition: (student) => student.attributes.health < 40, // ✅ 阈值判断写在这
                        prob: 0.7,  // 70% 概率进入本季随机候选
                        options: [
                          {
                            text: "去校医室",
                            action: () => {
                              student.attributes.health = Math.min(100, student.attributes.health + 8);
                              student.attributes.happy  = Math.max(0, student.attributes.happy  - 3);
                              showReport("🏥 休息治疗：健康 +8，心情 -3。");
                              closeEventModal();
                            }
                          },
                          {
                            text: "先扛一扛",
                            action: () => {
                              student.attributes.health = Math.max(0, student.attributes.health - 5);
                              showReport("😵 继续硬扛：健康 -5。");
                              closeEventModal();
                            }
                          }
                        ]
                      },
                      // 例：心情满值时触发的正向事件（设置 prob:1 保证入池，仍按随机抽取数量决定是否被选中）
                      {
                        id: "happy_peak_burst",
                        title: "🎉 灵感爆发",
                        desc: "状态顶峰，效率惊人！但兴奋过去后会回落。",
                        repeatable: false, // 只来一次
                        condition: (student) => student.attributes.happy >= 100,
                        prob: 1,
                        options: [
                          {
                            text: "抓住窗口期",
                            action: () => {
                              student.attributes.memory = Math.min(100, student.attributes.memory + 5);
                              student.attributes.logic  = Math.min(100, student.attributes.logic + 3);
                              student.attributes.happy  = Math.max(0, student.attributes.happy  - 30);
                              student.completedEvents.happy_peak_burst = true;
                              showReport("🚀 记忆 +5，逻辑 +3；兴奋回落，心情 -30。");
                              closeEventModal();
                            }
                          }
                        ]
                      }]
        }
console.log("加载了事件库",gameEventsData )
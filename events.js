        // ===== 事件库 =====
        const gameEventsData = {
                "18-0": [{ // 18岁春季固定事件
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
                                alert(`第一次模拟考结束！总分：${total}分`);
                                showReport(`💯第一次模拟考结束了，你总共拿了${total}分。`)
                                student.completedEvents.first_exam = true;
                                student.lastExamScores = {...student.scores}
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
                                alert(`第二次模拟考结束！总分：${total}分`);
                                showReport(`💯第二次模拟考结束了，你总共拿了${total}分。`)
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
                                    // alert("你吃的很开心！但是吃太多对身体可不好。");
                                    showReport(`在高中的最后一场运动会，你选择放松休息，大吃特吃。 你吃的很开心！但是吃太多对身体可不好。<strong>心情</strong>有所上升，<strong>运动值和魅力值</strong>有所下降。`);
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
                "18-1": [{
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
                                // takeExam();
                                // const gaokao_score = takeExam();
                                // alert(`高考结束的铃声响起，你的高中生活在这一刻似乎结束了。 `);
                                showReport(`😆你的高考结束了，现在终于可以放肆地玩了。等到月底再来查成绩吧！`);
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
                    }


            ],
                "random_events": [ // 随机事件池
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
                                }
                            },
                            {
                                text: "专心备考",
                                action: () => {
                                    student.attributes.memory += 5;AdjustAttributes('memory');
                                    //alert("心中无感情，下笔自然神！\n 脑子里没有了情情爱爱，记忆力似乎都好了！");
                                    showReport(`💭你在错误的时间喜欢上了一个人，但你的理智让你专注学习，心中无感情，下笔自然神！现在你的<strong>记忆力</strong>提高了一点。`);
                                    closeEventModal();
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
                                    if(Math.random<0.6){
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
                                }
                            },
                            {
                                text: "他们吵就吵吧，也不是第一天了，烦死了。",
                                action: () => {
                                    student.attributes.memory += 1;AdjustAttributes('memory');
                                    student.attributes.iq += 1;AdjustAttributes('iq');
                                    student.attributes.happy -= 5;AdjustAttributes('happy');
                                    //alert("你选择专注学习,但心里还是有些烦躁。");
                                    showReport(`🏠最近父母经常因为琐事争吵，你没有管他们，继续学习，心里有点烦躁。现在你的<strong>记忆力和智商</strong>提升了一点，<strong>心情</strong>下降了。`);
                                    closeEventModal();
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
                                    //alert("休息后你感觉好多了,但落下了一些功课。");
                                    showReport(`🤓最近连续的高强度学习让你感到极度疲惫,你选择休息放松一周。现在你的<strong>情商</strong>提升了，<strong>记忆力</strong>下降了。`);
                                    closeEventModal();
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
                                }
                            },
                            {
                                text: "不跑了，最近事情太多了，歇一歇吧",
                                action: () => {
                                    student.attributes.sport -= 3;AdjustAttributes('sport');
                                    alert("运动总是有时间的，希望下次，你能走出来运动运动吧！\n运动有一点下降。");
                                    showReport(`🏃‍ 本来想出去跑跑步，但是感觉事情太多了，还是没有去运动。现在你的<strong>运动</strong>下降了。`);
                                    closeEventModal();
                                }
                            }
                        ]
                    }
                ]
        }
console.log("加载了事件库",gameEventsData )
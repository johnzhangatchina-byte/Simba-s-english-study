# -*- coding: utf-8 -*-
"""Extra weekday/Saturday phrases and daily game tips for 小队电台英语."""

# Each week: 4 extra weekday phrases, then a --- line, then 2 Saturday phrases.
# Format: English | 中文 | cue
EXTRAS_RAW = r'''
W01
Please come in. | 请进。 | 做请进手势
This is my friend. | 这是我的朋友。 | 介绍身边的人
How are you? | 你怎么样？ | 微笑询问
I'm fine, thank you. | 我很好，谢谢。 | 点头微笑
---
Come to the yard. | 到院子这边来。 | 招手到院子
We are here. | 我们在这里。 | 站在集合点
W02
I can count to five. | 我能数到五。 | 伸开五指
How many bags do you see? | 你看见几个包？ | 指向背包
There are four of us. | 我们有四个人。 | 指小队
Let's count again. | 我们再数一遍。 | 重新报数
---
Please go to the door. | 请走到门那里。 | 指向门
The bags are here. | 背包在这里。 | 指着背包
W03
Are you ready? | 你准备好了吗？ | 询问队友
We can start now. | 我们现在可以开始了。 | 点头
Please wait for me. | 请等我一下。 | 招手请求等
Stay with the team. | 跟小队在一起。 | 站在队里
---
Come to the door. | 到门这边来。 | 招手
Let's start together. | 我们一起开始吧。 | 并肩出发
W04
Look left. | 向左看。 | 看左边
Look right. | 向右看。 | 看右边
Which way is it? | 是哪一边？ | 左右张望
Follow me, please. | 请跟我走。 | 招手请跟
---
Go up to the window. | 走到窗户那边。 | 指向窗户
Turn around at the start. | 在起点转过身。 | 转身
W05
I have a map. | 我有一张地图。 | 举起地图
The yard is here. | 院子在这里。 | 指院子
Show me the table. | 把桌子指给我看。 | 指向桌子
Let's find the radio. | 我们来找对讲机。 | 搜寻
---
Where is the window? | 窗户在哪里？ | 张望
Go to the door, please. | 请走到门那里。 | 指向门
W06
The bag is green. | 这个包是绿色的。 | 绿色包
I need my flashlight. | 我需要我的手电筒。 | 拿手电
Don't forget the map. | 别忘了地图。 | 提起地图
My boots are ready. | 我的靴子准备好了。 | 看看脚
---
Take the red bag. | 拿上红包。 | 提起红包
The flashlight is in the bag. | 手电筒在包里。 | 打开背包
W07
Look carefully. | 仔细看。 | 认真看
It is not far. | 它不远。 | 指向近处
Can you see the window? | 你看得见窗户吗？ | 看窗
I will look again. | 我会再看一次。 | 再看一眼
---
Can you see the door? | 你看得见门吗？ | 看门
The radio is here. | 对讲机在这里。 | 指向对讲机
W08
Please help me. | 请帮帮我。 | 伸出手
I can help you. | 我能帮你。 | 走上前
We can do it together. | 我们可以一起做。 | 并肩
Don't worry. | 别担心。 | 安慰朋友
---
Go to the team for help. | 去找小队帮忙。 | 走向队友
A friend can help you. | 朋友能帮你。 | 微笑点头
W09
Good job! | 做得好！ | 竖起大拇指
Well done, team. | 小队做得好。 | 表扬大家
You are very kind. | 你真好。 | 微笑
Thanks, my friend. | 谢谢，我的朋友。 | 致谢
---
Say thank you to the team. | 向小队说谢谢。 | 鞠躬
That was a big help. | 那帮了大忙。 | 点头致谢
W10
Please be quiet. | 请安静。 | 手放嘴唇
I am listening. | 我在听。 | 手拢在耳边
Speak slowly, please. | 请说慢一点。 | 做慢的手势
I heard you. | 我听到了。 | 点头
---
Listen at the table. | 在桌子旁听。 | 坐到桌边
Be quiet near the door. | 在门附近请安静。 | 轻声走
W11
Walk slowly. | 慢慢走。 | 放慢脚步
Stay close. | 靠近一点。 | 靠近队友
Don't run, please. | 请不要跑。 | 摆手提醒
Wait for your friend. | 等一等你的朋友。 | 回头等
---
Walk to the yard. | 走到院子去。 | 走向院子
Stay close to the team. | 靠近小队。 | 走在一起
W12
This is our camp. | 这是我们的营地。 | 指营地
I like this place. | 我喜欢这个地方。 | 环顾
Let's sit here. | 我们坐这里吧。 | 坐下
The camp is safe. | 营地很安全。 | 点头
---
Go to the table in camp. | 走到营地的桌子那里。 | 走向桌子
Sit near the bag. | 坐在包附近。 | 在包旁坐下
W13
This is Simba. Over. | 我是 Simba。完毕。 | 对着讲机说
Do you hear me? | 你能听到我吗？ | 对着讲机问
I hear you. Over. | 我听到了。完毕。 | 点头回话
Please say that again. | 请再说一遍。 | 手拢耳朵
---
Call the team at the start. | 在起点呼叫小队。 | 对着讲机
I hear you at the door. | 我在门口听到了。 | 在门边回话
W14
I am the map person. | 我是看地图的人。 | 举起地图
I can carry the bag. | 我可以背这个包。 | 背上包
You can take the radio. | 你可以拿对讲机。 | 递对讲机
We each have a job. | 我们每个人都有任务。 | 指每个人
---
The map person goes to the table. | 看地图的人走到桌子那里。 | 走向桌子
The radio is for the team. | 对讲机是给小队用的。 | 分享对讲机
W15
Team, this is Simba. | 小队，我是 Simba。 | 呼叫
What is your name? Over. | 你叫什么名字？完毕。 | 询问
I am at the yard. Over. | 我在院子。完毕。 | 报位置
Copy that. | 收到。 | 点头
---
Call from the window. | 从窗户这边呼叫。 | 在窗边呼叫
Say "over" at the end. | 最后要说“完毕”。 | 对着讲机结束
W16
Is the map here? | 地图在这里吗？ | 检查地图
I have the radio. | 我有对讲机。 | 举起对讲机
The flashlight is ready. | 手电筒准备好了。 | 拿手电
Everything is here. | 东西都在这里。 | 点清单
---
Check the bag, please. | 请检查背包。 | 打开背包
The kit is on the table. | 装备在桌子上。 | 看桌面
W17
It's under the table. | 它在桌子下面。 | 指桌下
It's near the window. | 它在窗户附近。 | 指窗边
Look in the bag. | 在包里找找。 | 打开包
I know where it is. | 我知道它在哪里。 | 点头
---
Look near the window. | 在窗户附近看。 | 看窗边
The bag is by the door. | 包在门边。 | 指门边的包
W18
Let's go to the yard. | 我们去院子吧。 | 指向院子
Meet me at the door. | 在门口和我碰面。 | 指门
I will go first. | 我先走。 | 踏出一步
Please go with the team. | 请和小队一起走。 | 招手
---
Meet me at the door. | 在门口和我碰面。 | 走向门
Go to the yard with me. | 和我一起去院子。 | 走向院子
W19
I am near the window. | 我在窗户附近。 | 报窗户
Where are you now? | 你现在在哪里？ | 询问位置
The team is at the start. | 小队在起点。 | 指起点
I see you on my right. | 我看见你在我右边。 | 看右边
---
I am at the window. | 我在窗户那里。 | 站在窗边
The team is at the start. | 小队在起点。 | 指起点
W20
First, take the map. | 首先，拿上地图。 | 拿地图
Then stay together. | 然后，待在一起。 | 并肩
The plan is simple. | 计划很简单。 | 摊开计划
Let's say the plan again. | 我们再把计划说一遍。 | 复述
---
First, go to the start. | 首先到起点去。 | 走向起点
Then go to the table. | 然后走到桌子那里。 | 走向桌子
W21
Did you find it? | 你找到了吗？ | 询问
I can help you look. | 我能帮你一起找。 | 帮忙找
Look near the bag. | 在包附近找。 | 看背包
We found it together. | 我们一起找到了。 | 一起举起
---
Look near the bag. | 在包附近找。 | 走向背包
I found it at the table. | 我在桌子那里找到了。 | 在桌边举起
W22
It is getting late. | 天色有些晚了。 | 看天色
Stay in the light. | 待在有光的地方。 | 走向亮处
The sun is up. | 太阳升起来了。 | 指太阳
We have time to rest. | 我们有时间休息。 | 看时间
---
Take the flashlight from the bag. | 从包里拿手电筒。 | 打开背包
Turn on the light at the door. | 在门口把灯打开。 | 在门边开灯
W23
Do you need a break? | 你需要休息吗？ | 关切地问
Have some water. | 喝一点水吧。 | 递水瓶
I can wait for you. | 我可以等你。 | 坐下等
We are ready again. | 我们又准备好了。 | 站起来
---
Rest at the table. | 在桌子旁休息。 | 在桌边坐下
Get water from the bag. | 从包里拿水。 | 打开背包
W24
My character has a map. | 我的角色有一张地图。 | 角色拿地图
She can help the team. | 她能帮助小队。 | 角色帮忙
This role is the radio person. | 这个角色是对讲员。 | 角色卡
I like my character. | 我喜欢我的角色。 | 展示画
---
Show your character at the table. | 在桌子上展示你的角色。 | 把画放桌上
The scout looks at the yard. | 侦察员看向院子。 | 看向院子
W25
Draw the path here. | 把路画在这里。 | 画路线
This is a landmark. | 这是一个地标。 | 指大树
The end is by the river. | 终点在河边。 | 指河
Make the path clear. | 把路画清楚。 | 描线
---
Draw the start here. | 把起点画在这里。 | 画起点
The house is by the door. | 房子在门这边。 | 指门边
W26
A good plan is short. | 好计划是简短的。 | 点头
We check the plan first. | 我们先检查计划。 | 看计划
Stay with the plan. | 按计划走。 | 指计划
We can do this. | 我们能做到。 | 轻轻击掌
---
Check the map first. | 先看地图。 | 看地图
Then go together. | 然后一起走。 | 并肩走
W27
Here is a short brief. | 这是一段简短说明。 | 举手说明
Please say it back. | 请复述一遍。 | 请对方说
The brief is clear. | 说明很清楚。 | 点头
I can remember it. | 我能记住它。 | 指自己的头
---
Listen to the brief at the table. | 在桌子旁听说明。 | 在桌边听
Then wait at the door. | 然后在门口等。 | 走到门口
W28
I go this way because it is short. | 我走这边，因为路更短。 | 指短路
We wait because we need the team. | 我们等，因为需要小队。 | 等待队友
That is why we go left. | 所以我们向左走。 | 说明原因
Can you tell me why? | 你能告诉我为什么吗？ | 询问原因
---
We go left because it is safe. | 我们向左走，因为更安全。 | 选择左边
We wait at the door because we need the team. | 我们在门口等，因为需要小队。 | 在门口等
W29
If we see the door, we stop. | 如果我们看见门，就停下。 | 看到门停下
If you are ready, let's go. | 如果你准备好了，我们就走。 | 条件出发
Then we check the map. | 然后我们看地图。 | 接着看图
If I need help, I will call. | 如果我需要帮助，我会呼叫。 | 举起对讲机
---
If you see the door, stop. | 如果你看见门，就停下。 | 在门前停
If you are ready, go to the start. | 如果你准备好了，就到起点。 | 走向起点
W30
This way is longer. | 这条路更长。 | 比划长线
That way is shorter. | 那条路更短。 | 比划短线
Which way do you like? | 你喜欢哪条路？ | 询问选择
I choose the short way. | 我选短的那条。 | 做出选择
---
The left way is short. | 左边的路很短。 | 指左边
The right way is longer. | 右边的路更长。 | 指右边
W31
Can I make a suggestion? | 我可以提一个建议吗？ | 举手
Let's listen to everyone. | 我们听听每个人的想法。 | 围在一起
That is a good idea. | 那是个好主意。 | 点头
We can try your way. | 我们可以试试你的办法。 | 同意
---
Ask the team at the start. | 在起点问小队。 | 在起点商量
Share your idea at the table. | 在桌子旁分享你的主意。 | 在桌边说
W32
There is a bag in the room. | 房间里有一个包。 | 指包
The room has a door and a window. | 房间有门和窗户。 | 环顾房间
It is bright in here. | 这里很亮。 | 看光线
Please describe the room. | 请描述这个房间。 | 邀请对方说
---
The bag is by the door. | 包在门边。 | 指门边
Describe the table, please. | 请描述这张桌子。 | 看桌子
W33
Let's look first. | 我们先看一看。 | 先观察
Let's check again. | 我们再检查一遍。 | 再检查
Don't rush. | 不要着急。 | 伸手慢下来
We move together. | 我们一起移动。 | 并肩走
---
Look first at the window. | 先看窗户。 | 看向窗户
Then move to the door. | 然后走到门那里。 | 走向门
W34
This is the start of the level. | 这是关卡的起点。 | 指关卡起点
Players need a clear path. | 玩家需要一条清楚的路。 | 指路线
Add a landmark here. | 在这里加一个地标。 | 画地标
The level should be fair. | 关卡应该公平。 | 点头
---
Show the start on the table. | 在桌子上展示起点。 | 把图放桌上
The path goes to the door. | 这条路通向门。 | 沿路指向门
W35
Make it simple. | 做得简单一些。 | 简化图纸
Test the path with a friend. | 和朋友一起试走路。 | 一起试玩
Is this too hard? | 这个会不会太难？ | 询问难度
I will change this part. | 我要改改这部分。 | 修改一处
---
Test the path from the start. | 从起点试走这条路。 | 从起点出发
Change the part by the window. | 改改窗户旁边的部分。 | 看窗边
W36
Can I have the map, please? | 请把地图给我，好吗？ | 伸手
Here you are. | 给你。 | 递出东西
Can I borrow the radio? | 我能借用一下对讲机吗？ | 礼貌询问
Sure, you can. | 当然可以。 | 点头同意
---
Ask for the bag, please. | 请要一下这个包。 | 指向背包
The map is on the table. | 地图在桌子上。 | 看桌子
W37
We walked together. | 我们一起走了。 | 回顾走过的路
I checked the map. | 我看过地图了。 | 回顾看图
We helped a friend. | 我们帮助了一个朋友。 | 回顾互助
It was a good plan. | 那是个好计划。 | 回顾计划
---
We walked to the door. | 我们走到了门那里。 | 走向门
I checked the map on the table. | 我在桌子上看过地图。 | 在桌边看图
W38
Listen to the whole story. | 请听完整个故事。 | 认真听
What happened first? | 一开始发生了什么？ | 提问
I can tell the story too. | 我也能讲这个故事。 | 举手
That was a good story. | 那是个好故事。 | 轻轻鼓掌
---
Tell the story at the table. | 在桌子旁讲故事。 | 在桌边讲
The story starts at the yard. | 故事从院子开始。 | 指院子
W39
Remember the five steps. | 记住这五个步骤。 | 伸开五指
Say the plan slowly. | 慢慢把计划说出来。 | 慢速说明
Everyone knows the goal. | 每个人都知道目标。 | 指目标
We follow the plan together. | 我们一起按计划走。 | 并肩
---
Our goal is on the table. | 我们的目标在桌子上。 | 看桌子
Go through the door first. | 先穿过这扇门。 | 走向门
W40
It's your turn to talk. | 轮到你说了。 | 指向对方
I will listen first. | 我先听。 | 认真听
Let's take turns. | 我们轮流说。 | 轮流手势
That was a clear answer. | 那个回答很清楚。 | 点头
---
Take turns at the table. | 在桌子旁轮流说。 | 在桌边轮流
It is your turn at the start. | 在起点轮到你了。 | 在起点示意
W41
Please, after you. | 请，你先请。 | 让路
Excuse me, please. | 不好意思，借过。 | 侧身
Could you help me, please? | 请问你能帮我吗？ | 礼貌询问
It was nice to work with you. | 和你一起很愉快。 | 微笑致谢
---
Please go to the door first. | 请你先走到门那里。 | 请对方先走
Excuse me, I need the bag. | 不好意思，我需要这个包。 | 指向背包
W42
Let me show you my map. | 我来给你看我的地图。 | 展开地图
This mark means the start. | 这个记号代表起点。 | 指记号
Do you have any questions? | 你有问题吗？ | 询问
I can explain it again. | 我可以再讲一遍。 | 再讲一次
---
Show your map on the table. | 在桌子上展示你的地图。 | 把地图放桌上
This mark is the door. | 这个记号是门。 | 指门的记号
W43
The first rule is: stay together. | 第一条规则是：待在一起。 | 举起一指
Please follow the rules. | 请遵守规则。 | 点头
This rule keeps us safe. | 这条规则能让我们更安全。 | 说明理由
Any questions about the rule? | 对这条规则有问题吗？ | 询问
---
Tell the rule at the start. | 在起点讲规则。 | 在起点说明
The rule is: wait at the door. | 规则是：在门口等。 | 指向门
W44
Go straight, then turn left. | 一直走，然后向左转。 | 指路
You will see a big tree. | 你会看到一棵大树。 | 指地标
The door is next to the yard. | 门就在院子旁边。 | 说明位置
I can walk with you. | 我可以和你一起走。 | 陪伴
---
Go straight to the yard. | 一直走到院子。 | 走向院子
Then turn left at the door. | 然后在门口向左转。 | 在门口左转
W45
I am ready to listen. | 我准备好听了。 | 坐好准备
Here is my sentence. | 这是我要说的一句。 | 举手说
I can share one idea. | 我能分享一个想法。 | 分享
Thank you for listening. | 谢谢你们听我说。 | 致谢
---
Share your sentence at the table. | 在桌子旁分享你的句子。 | 在桌边说
Listen to the brief at the start. | 在起点听说明。 | 在起点听
W46
The old plan is not working. | 旧计划行不通了。 | 轻轻摇头
Let's change this step. | 我们改改这一步吧。 | 修改一步
A new plan is okay. | 换新计划也可以。 | 点头
Now the plan is better. | 现在计划更好了。 | 展示新计划
---
Change the step at the door. | 改改门口这一步。 | 看门口
The new plan is on the table. | 新计划在桌子上。 | 看桌子
W47
Hello, I am the guide. | 你好，我是向导。 | 介绍自己
My job is to read the map. | 我的工作是看地图。 | 说明工作
What is your job? | 你的工作是什么？ | 询问分工
We can switch jobs later. | 我们稍后可以换工作。 | 轮换任务
---
The guide goes to the table. | 向导走到桌子那里。 | 走向桌子
Introduce yourself at the start. | 在起点介绍你自己。 | 在起点介绍
W48
I will show my map first. | 我先展示我的地图。 | 准备展示
Please look at this part. | 请看这一部分。 | 指向图上
I practiced this at home. | 我在家练习过这个。 | 回想练习
I hope you like it. | 希望你们会喜欢。 | 微笑
---
Show it on the table. | 在桌子上展示。 | 把作品放桌上
Practice at the start first. | 先在起点练习。 | 在起点练习
W49
This word is hard for me. | 这个词对我有点难。 | 指出难点
I want to practice it again. | 我想再练习一遍。 | 再练一次
Can you say it slowly? | 你能说慢一点吗？ | 请求慢速
I am getting better. | 我正在进步。 | 点头微笑
---
Practice the hard word at the table. | 在桌子旁练习难词。 | 在桌边练习
Say it slowly at the start. | 在起点慢慢说。 | 在起点慢说
W50
It's okay to ask for help. | 请求帮助没有关系。 | 鼓励开口
I am here for you. | 我就在你身边。 | 陪伴
Thank you, I feel better. | 谢谢，我感觉好多了。 | 微笑
Let's finish it together. | 我们一起把它做完。 | 合作
---
Ask for help at the window. | 在窗户那边求助。 | 走向窗户
A friend is at the door. | 有一位朋友在门口。 | 看向门
W51
I remember the first week. | 我记得第一周。 | 回忆
We learned to use a map. | 我们学会了用地图。 | 举起地图
I am proud of our team. | 我为小队感到骄傲。 | 挺胸微笑
Let's keep practicing. | 我们继续练习吧。 | 鼓励
---
Remember the map on the table. | 记得桌子上的地图。 | 看桌子
We helped a friend at the door. | 我们在门口帮助过朋友。 | 走向门
W52
I am happy to be here. | 我很高兴来到这里。 | 开场微笑
This is the end of our year. | 这是我们这一年的结尾。 | 收束
I will keep using these words. | 我会继续使用这些用语。 | 轻轻点头
Goodbye, team. See you. | 再见，小队。回头见。 | 挥手
---
Give your report at the start. | 在起点做报告。 | 站在起点
Show the map on the table. | 在桌子上展示地图。 | 把地图放桌上
'''.strip()

# 7 tips per week (Mon-Sun). Format: 标题 | English | 中文
TIPS_RAW = r'''
W01
先问好 | A good teammate says hello first. | 好队员会先问好。
告诉名字 | Tell the team your name so they know you. | 告诉小队你的名字，他们才认识你。
准备好再出发 | Ready means you are listening and looking. | 准备好了，就是在听、也在看。
一起走 | Walk together so no one is left behind. | 一起走，不丢下任何人。
欢迎新队员 | A smile makes a new teammate feel welcome. | 微笑能让新队员感到被欢迎。
看集合点 | On the map, the meeting point is where the team starts. | 地图上，集合点就是小队出发的地方。
每天一句 | Practice one team word every day this week. | 这一周，每天练习一句小队用语。
W02
数一数队友 | Count your teammates before you start. | 出发前先数一数队友。
看装备数量 | Check how many bags the team is carrying. | 看看小队带了几个包。
四人小队 | A team of four can share four jobs. | 四人小队可以分四个任务。
一起报数 | Counting out loud helps everyone stay together. | 大声报数能帮助大家不走散。
记得每个人 | A good leader notices if someone is missing. | 好队长会注意到是不是少了人。
地图上也要数 | When you design a map, mark how many places there are. | 设计地图时，标出一共有几个地点。
复习数字 | This week, count things you see around the house. | 这一周，数一数家里能看见的东西。
W03
先问准备好了吗 | Ask “Are you ready?” before the team moves. | 小队移动前，先问“准备好了吗？”
出发信号要清楚 | A clear start signal helps the whole team. | 清楚的出发信号能帮助整个小队。
会等也很重要 | Waiting is part of teamwork, not a delay. | 等待也是合作的一部分，不是耽误。
跟上队伍 | If you walk first, look back for your friends. | 如果你走在前面，要回头看看朋友。
停下就要停住 | When someone says stop, the whole team stops. | 有人说停，整个小队都要停下。
信号画在地图上 | You can mark start and stop points on a map. | 你可以在地图上标出起点和停止点。
练习三个动作 | Practice wait, start, and stop with your family. | 和家人练习“等、开始、停”。
W04
先分清左右 | Learn left and right on your own body first. | 先在自己身上分清左边和右边。
用手势指路 | Point the way so words and hands match. | 用手指路，让话和手势一致。
不要急着转 | Look first, then turn. | 先看，再转。
给别人留时间 | Say the direction slowly so everyone can hear. | 方向要说慢一点，让每个人都听见。
路标要看清 | A sign on the path is easier than a long sentence. | 路上的路标比长句子更容易看懂。
在地图上画箭头 | When you design a level, draw clear arrows. | 设计关卡时，把箭头画清楚。
左右小练习 | This week, say left and right when you walk at home. | 这一周，在家走路时说说“左”和“右”。
W05
先看地图再走 | Look at the map before you move. | 先看地图，再移动。
把东西画清楚 | Doors, windows, and tables should look different on a map. | 地图上的门、窗和桌子要能分清。
对讲机放固定处 | Keep the radio in a place the team can find. | 把对讲机放在小队容易找到的地方。
问“在哪里” | It’s okay to ask “Where is it?” | 问“它在哪里？”没有关系。
用地图说话 | Point to the map when you explain a place. | 讲解地点时，用手指着地图。
图标比文字清楚 | Simple pictures on a map help young players. | 地图上的简单图画能帮助小朋友。
认识家里的地图 | Draw one room at home and label the door. | 画一个家里的房间，并标出房门。
W06
出发前点装备 | Check your bag, map, and light before you go. | 出发前检查包、地图和灯。
颜色帮助记忆 | Color helps you find things faster. | 颜色能让你更快找到东西。
手电要放好 | Put the flashlight back in the bag after you use it. | 用完手电筒，要放回包里。
不要忘带地图 | The map is part of the team kit. | 地图也是小队装备的一部分。
分享装备 | If a friend has no bag, share when you can. | 如果朋友没有包，能分享就分享。
设计时用颜色 | In a game map, use colors to mark important places. | 在游戏地图里，用颜色标出重要的地方。
整理小背包 | This week, pack a small bag with a bottle and a notebook. | 这一周，把水瓶和笔记本装进小包里。
W07
仔细看再下结论 | Look carefully before you say “I can’t see it.” | 说“我看不见”之前，先仔细看。
换个角度 | If you can’t see it, take one step and look again. | 如果看不见，就走一步再看。
请队友一起看 | Two pairs of eyes find things faster. | 两双眼睛能更快找到东西。
指向要明确 | When you say “over there,” point at the same time. | 说“在那边”的时候，要一起用手指。
找到了要说出来 | When you see it, tell the team right away. | 看见了，就马上告诉小队。
遮挡也是设计 | In a level, hide a landmark a little so players look carefully. | 在关卡里，可以把地标稍微藏一点，让玩家仔细看。
观察练习 | Notice three new things on your way home. | 回家路上，试着发现三件新事物。
W08
开口求助没问题 | Asking for help is a brave team move. | 请求帮助，是勇敢的小队行为。
先问“你还好吗” | Check on a friend before you give advice. | 给建议之前，先问问朋友还好吗。
帮忙要先征得同意 | Ask “Can I help you?” before you jump in. | 先问“我能帮你吗？”，再动手帮。
谢谢要说出来 | A clear thank-you makes help feel seen. | 清楚地说谢谢，能让帮助被看见。
轮流当帮手 | Today you help; tomorrow a friend may help you. | 今天你帮别人，明天别人也可能帮你。
关卡里可以设互助 | A good level lets players help each other. | 好的关卡会让玩家互相帮助。
练习求助句 | Practice saying “I need help” in a calm voice. | 练习用平静的声音说“我需要帮助”。
W09
表扬要具体 | Say what your friend did well. | 要说清楚朋友哪件事做得好。
谢谢要及时 | Thank people when the help is still fresh. | 在刚被帮助时就说谢谢。
小队也要被看见 | Celebrate the whole team, not only one person. | 要为整个小队庆祝，不只是一个人。
善意的话有力量 | Kind words help a team more than loud words. | 善意的话比很大声的话更有帮助。
接受表扬也从容 | When someone says “good job,” you can smile and say thanks. | 别人说“做得好”时，你可以微笑并说谢谢。
用贴纸做奖励 | In a game you design, a star can mean “kind play.” | 在你设计的游戏里，星星可以代表“友好的玩法”。
今天夸一句 | Tell a family member one kind thing they did. | 今天对家人说一句具体的夸奖。
W10
先听完整句 | Listen to the whole sentence before you answer. | 先听完整句话，再回答。
安静是一种技能 | Being quiet helps the team hear important words. | 安静能帮助小队听清重要的话。
请对方说慢一点 | It’s okay to say “Speak slowly, please.” | 说“请说慢一点”没有关系。
对讲时轮流说 | On a team radio, one person talks at a time. | 小队对讲时，一次只有一个人说。
听懂了要回应 | A short “I heard you” keeps the team sure. | 一句“我听到了”，能让小队放心。
关卡也要有提示音或标记 | Players need a clear cue, not a noisy map. | 玩家需要清楚的提示，而不是很乱的地图。
练习倾听 | Sit still and listen for five sounds around you. | 安静坐一会儿，听听周围的五种声音。
W11
步伐要一致 | Walk at a speed the slowest friend can follow. | 走路的速度，要让走得最慢的朋友跟得上。
靠近才叫一起 | Together means close enough to see and hear. | 在一起，就是近到能看见、能听见。
不要跑散 | Running ahead can split the team. | 跑到前面去，可能让小队走散。
回头等候 | If a friend stops, the team waits. | 如果有朋友停下，小队就要等。
用话提醒 | A kind “Stay close” is better than a shout. | 轻轻说“靠近一点”，比大声喊更好。
路的宽度要合理 | In a level, make the path wide enough for friends to walk together. | 设计关卡时，路要够宽，好让朋友一起走。
和家人齐步走 | Practice walking side by side for one short trip. | 和家人并排走一小段路。
W12
营地先安排座位 | At camp, pick a place to sit and talk. | 在营地，先选一个能坐下说话的地方。
喜欢也要说出来 | Sharing “I like this place” helps the team feel at home. | 说出“我喜欢这个地方”，能让小队更安心。
安全第一 | A safe camp is a good camp. | 安全的营地，才是好营地。
休息也是任务 | Sitting down together is still teamwork. | 一起坐下来，也是在合作。
保持营地整洁 | Put bags in one place so the camp stays clear. | 把包放在一个地方，营地会更整齐。
设计休息点 | Every longer level needs a quiet rest spot. | 比较长的关卡，需要一个安静的休息点。
布置小角落 | Make a small “camp” corner at home with a map and a bottle. | 在家用地图和水瓶布置一个小小的营地角。
W13
先报自己的名字 | On the radio, start with your name. | 对讲时，先报上自己的名字。
问“听到了吗” | Check that your friend can hear you. | 确认朋友能听见你。
听不清就请再说 | “Please say that again” is a useful radio sentence. | “请再说一遍”是很有用的对讲句子。
完毕再交给别人 | Say “Over” so the next person knows it is their turn. | 说“完毕”，下一个人就知道轮到自己了。
声音保持平静 | A calm voice is easier to understand. | 平静的声音更容易听懂。
对讲规则写进设计 | If your game has a radio, write simple talk rules. | 如果你的游戏里有对讲机，请写上简单的通话规则。
对镜练习呼叫 | Practice a short radio call in a slow, clear voice. | 用慢而清楚的声音，练习一句短短的呼叫。
W14
先分工再出发 | Give everyone a job before you start. | 出发前，先给每个人一个任务。
看地图的人要分享 | The map person should show the map, not hide it. | 看地图的人要展示地图，而不是藏起来。
背包可以轮流背 | Sharing the bag keeps the team fair. | 轮流背包，对小队更公平。
对讲员要听两边 | The radio person listens to the team and to the call. | 对讲员既要听小队，也要听呼叫。
每个人都重要 | A team is stronger when every role is respected. | 每个角色都被尊重，小队才会更强。
角色卡要好懂 | When you design characters, give each one a clear job. | 设计角色时，让每个人都有清楚的任务。
家庭角色游戏 | Today, choose a job: map, radio, or bag. | 今天选一个任务：看地图、对讲，或者背包。
W15
呼叫要短 | A short radio call is easier to remember. | 短的呼叫更容易记住。
先叫小队再说话 | Start with the team name so everyone listens. | 先叫小队的名字，大家才会注意听。
报位置要清楚 | Say where you are, not just how you feel. | 要说清自己在哪里，不只说感觉如何。
收到了就回复 | “Copy that” tells the speaker you understood. | 说“收到”，对方就知道你听懂了。
不要抢话 | Wait for “Over” before you talk. | 等对方说“完毕”后再说话。
呼叫点可以标在地图上 | Mark good radio spots on your map. | 在地图上标出适合呼叫的位置。
短呼叫练习 | Make a two-line radio call: name, then place. | 做一次两句呼叫：先报名，再报位置。
W16
出发前清点清单 | Use a short list so nothing is left behind. | 用一张短清单，避免漏带东西。
地图、对讲、手电 | Map, radio, and flashlight are a useful set. | 地图、对讲机和手电筒是一套很有用的装备。
用完放回原处 | Put each item back so the next person can find it. | 把每件东西放回原处，方便下一个人找到。
装备是大家的 | Team kit belongs to the team, not to one person. | 小队装备属于大家，不只属于一个人。
检查时大声说 | Say the name of each item as you check it. | 清点时，一边看一边说出名字。
道具不要太多 | In a game, too many items can confuse players. | 在游戏里，道具太多会让玩家困惑。
家庭小点验 | Make a three-item list and check it tonight. | 列一个三件套清单，今晚清点一次。
W17
先想可能在哪 | Think of likely places before you search everywhere. | 先想想可能在哪，再到处找。
从近处找到远处 | Search near, then far. | 先找近处，再找远处。
包里也要看 | Bags, tables, and windows are common hiding spots. | 包里、桌子和窗户旁边，常常能找到东西。
找到要告诉大家 | When you know where it is, share the place. | 知道在哪里后，要把地点告诉大家。
没找到不要慌 | If it’s not here, try one more place together. | 如果这里没有，就一起再找一个地方。
藏东西也要合理 | In a level, hidden items should still be fair to find. | 关卡里藏东西，也要让人有公平的机会找到。
寻找练习 | Hide a hat at home and give two clues. | 在家藏一顶帽子，并给出两条线索。
W18
先说目的地 | Say where you are going before you walk. | 走路之前，先说要去哪里。
约定碰面地点 | “Meet me at the door” keeps the team from getting lost. | “在门口碰面”能避免小队走散。
可以请人先走 | Sometimes one person leads, and the others follow. | 有时一个人带路，其他人跟着。
和队伍一起行动 | Going with the team is safer than going alone. | 和小队一起走，比独自走更安心。
目的地要在地图上 | If it’s not on the map, add it before you go. | 如果地图上没有这个地点，先补上再出发。
关卡要写清目标 | Players should know the next place to go. | 玩家应该知道下一个要去的地方。
给家人带路 | Guide a family member from one room to another in English. | 用英语带家人从一个房间走到另一个房间。
W19
报位置用参照物 | Use a door, table, or window to say where you are. | 用门、桌子或窗户来说明你在哪里。
左右要分清 | “On my left” is from your view, so face the team when you can. | “在我左边”是按你的方向说的，能面对小队时更好。
前后也要说清 | Behind and in front help the team make a picture. | 说清前面和后面，能帮助小队想象位置。
问“你在哪里” | If you lose sight of a friend, ask where they are. | 如果看不见朋友，就问他在哪里。
短句更好记 | A short place call is better than a long story. | 简短的位置呼叫，比讲很长更好。
地图上标出“我在这里” | A pin on a map can mean “I am here.” | 地图上的图钉可以表示“我在这里”。
家庭位置呼叫 | Stand in a room and say your place in English. | 站在一个房间里，用英语说出你的位置。
W20
计划要短 | A good plan can be three or four short steps. | 好计划可以只有三四个短步骤。
先说顺序词 | Use first, then, and next so the order is clear. | 用“首先、然后、接着”，顺序会更清楚。
计划要让大家都听见 | Say the plan to the whole team, not just one friend. | 计划要说给整个小队听，不只说给一个人。
出发前再复述 | Repeating the plan helps everyone remember. | 再把计划说一遍，能帮助大家记住。
简单往往更好 | A simple plan is easier to follow than a clever one. | 简单的计划，往往比很复杂的计划更容易执行。
关卡也要有步骤 | Write the player’s steps in order on a card. | 把玩家的步骤按顺序写在一张卡片上。
写一个三步计划 | Make a tiny plan for packing your school bag. | 为整理书包做一个小小的三步计划。
W21
再找一次别放弃 | Look again before you say it’s gone. | 说“找不到了”之前，再找一次。
请人一起找 | Two people searching is a better plan. | 两个人一起找，是更好的办法。
缩小寻找范围 | Name one area: the bag, the table, or the yard. | 先确定一个范围：包、桌子或院子。
找到了要分享喜悦 | “Here it is!” is a happy team sentence. | “在这儿呢！”是一句让小队高兴的话。
丢了先告诉队友 | If something is missing, tell the team early. | 如果有东西不见了，早点告诉小队。
寻找关卡要公平 | Give players enough clues to find the item. | 要给玩家足够的线索去找到物品。
家里寻物 | Ask someone to hide a book and give one English clue. | 请家人藏一本书，并用一句英语给线索。
W22
光线会影响判断 | If it’s dark, slow down and use a light. | 如果光线暗了，就放慢速度并打开灯。
手电为大家服务 | Point the flashlight at the path, not at faces. | 把手电筒照向路，不要照向脸。
白天也要计划 | Morning is a good time to check the map. | 早上很适合检查地图。
注意时间 | A short rest can help if it is getting late. | 如果天色晚了，可以先短暂休息。
亮处会合更安心 | Meet in a bright place when you can. | 能在明亮的地方会合，会更安心。
关卡里的白天和傍晚 | Light and dark can change the mood of a level. | 明亮和傍晚，能改变关卡的气氛。
观察光线 | Notice how your room looks in the morning and at night. | 看看房间在早晨和晚上有什么不同。
W23
累了就要说 | Telling the team “I’m tired” is responsible. | 告诉小队“我累了”，是负责任的做法。
休息不是放弃 | A short rest helps the team go farther later. | 短暂休息，能帮助小队走得更远。
记得喝水 | A water break is part of a good plan. | 喝水休息，也是好计划的一部分。
问朋友需不需要停 | A kind teammate notices when a friend needs a break. | 好队员会注意到朋友是不是需要休息。
休息后再出发 | Start again only when the team is ready. | 等小队都准备好了，再继续出发。
关卡要有歇脚处 | Don’t make a level with no place to pause. | 不要把关卡设计成完全没有停下来的地方。
主动休息一次 | Today, pause for a drink of water during homework. | 今天写作业时，停下来喝一口水。
W24
角色要有特点 | Give your character one clear trait, like careful or kind. | 给你的角色一个清楚的特点，比如细心或友善。
装备也能说明角色 | A bag or a map can show what the character does. | 背包或地图，能说明这个角色是做什么的。
侦察员先观察 | A scout looks and then tells the team. | 侦察员先观察，再告诉小队。
勇敢不是莽撞 | Brave can mean staying calm and helping others. | 勇敢也可以是保持冷静、帮助别人。
自己做的角色更有爱 | You care more about a character you made yourself. | 自己做的角色，你会更在意。
一张角色卡就够 | A simple card with a name, a job, and a picture is a good start. | 一张写着名字、任务和画的卡片，就是很好的开始。
画一个角色 | Draw a kind character and give them a job. | 画一个友善的角色，并给他一个任务。
W25
先画起点 | Every map needs a clear start. | 每张地图都需要清楚的起点。
地标帮助认路 | A tree, a house, or a river helps players know where they are. | 树、房子或河，能帮助玩家知道自己在哪里。
路不要画太乱 | A short, clear path is easier than many crossing lines. | 短而清楚的路，比很多交叉线更容易走。
房子和门要对应 | If you draw a house, show where the door is. | 如果画了房子，也要画出门在哪里。
给地图起名字 | A title helps your map feel finished. | 一个标题能让地图看起来更完整。
让别人试着看懂 | Ask a friend if they can find the start and the end. | 问问朋友，能不能找到起点和终点。
画一张家地图 | Draw a simple map from your bed to the door. | 画一张从床到门口的简单地图。
W26
短计划最好记 | A short plan is easier to remember under pressure. | 简短的计划，在紧张时也更容易记住。
先看图再行动 | Checking the map first prevents extra walking. | 先看地图，可以少走冤枉路。
“一起走”也是计划 | Staying together can be a step in the plan. | “待在一起”也可以是计划中的一步。
计划完成要回顾 | After you finish, say what went well. | 完成后，说说哪些地方做得好。
好计划可以再用 | If a plan works, you can use it again next time. | 如果计划有效，下次还可以再用。
把计划写成三步卡 | Write three short steps on paper and keep it with the map. | 把三个短步骤写在纸上，和地图放在一起。
复习一个小计划 | Make a three-step plan for tomorrow morning. | 为明天早上做一个三步计划。
W27
简报只要两句也可以 | A brief can be two clear sentences. | 简报可以只有两句清楚的话。
先听再复述 | Saying it back shows you understood. | 复述一遍，说明你听懂了。
简报不要太快 | Speak slowly so the brief stays clear. | 说慢一点，简报才会清楚。
听懂了要说出来 | “I understand” helps the speaker know they can stop. | 说“我明白了”，对方就知道可以结束了。
简报和计划要一致 | Don’t change the plan silently after the brief. | 简报结束后，不要偷偷改计划。
给玩家一张简报卡 | In a game, a short brief can start the level. | 在游戏里，可以用一张短简报开始关卡。
练习两句说明 | Tell a family member two sentences about your day. | 用两句话向家人说明你的一天。
W28
说出为什么 | A team follows a plan better when they know why. | 知道原因，小队会更好地执行计划。
用 because 连接 | “Because” is a small word that makes a reason clear. | “因为”虽小，却能把原因说清楚。
原因要真实 | Give a real reason, like “it’s shorter” or “it’s safer.” | 要给真实的原因，比如“更短”或“更安全”。
也可以问为什么 | Asking why helps you learn your teammate’s thinking. | 问为什么，能帮你了解队友的想法。
理由短一些更好 | One short reason is better than a long speech. | 一个短理由，比讲一大段更好。
设计时也要有理由 | If two paths exist, know why a player might choose each one. | 如果有两条路，要想想玩家为什么会选其中一条。
练习讲原因 | Explain why you chose your clothes today in one sentence. | 用一句话说说今天为什么这样穿。
W29
如果…就…很管用 | “If… then…” helps a team prepare. | “如果…就…”能帮助小队提前做准备。
先想可能发生的事 | Talk about one “if” before you start. | 出发前，先谈一个“如果”。
条件句要简单 | Use simple conditions the whole team can remember. | 用整个小队都能记住的简单条件。
求助也可以有约定 | “If I need help, I will call” is a strong agreement. | “如果我需要帮助，我会呼叫”是很好的约定。
不要设定太多如果 | Too many ifs make a plan hard to follow. | “如果”太多，计划就很难执行。
关卡里的分支要少而清 | One or two clear choices are enough for a short level. | 一个短关卡，有一两个清楚的选择就够了。
写一句如果 | Write one “If… then…” rule for your room, like putting a book back. | 给你的房间写一句“如果…就…”的规则。
W30
比较后再选择 | Compare two ways before you pick one. | 先比较两条路，再做选择。
短不一定最好 | The short way is not always the safest way. | 更短的路，不一定总是更安全。
安全也很重要 | A safe path can be worth a little more time. | 安全的路，多花一点时间也值得。
问问别人喜欢哪条 | Your teammate may see something you missed. | 队友也许看见了你没注意到的地方。
选定后就一起走 | Once you choose, the whole team follows that way. | 一旦选定，整个小队都走那条路。
两条路让游戏更有趣 | Two paths can make a level more interesting. | 两条路能让关卡更有趣。
比较两个选择 | Compare two ways to tidy your desk and pick one. | 比较两种整理书桌的方法，然后选一个。
W31
先征求意见 | Ask “What do you think?” before you decide. | 做决定前，先问“你觉得呢？”
建议要客气 | A suggestion sounds kinder than an order. | 建议听起来比命令更客气。
认真听每个人 | Even a short idea can be the best one. | 即使是很短的想法，也可能是最好的。
同意要说清楚 | “I agree” helps the team move on. | 说“我同意”，能帮助小队继续往前。
一起决定更公平 | A shared decision keeps the team together. | 一起做决定，能让小队更团结。
游戏规则也可以一起定 | Let players help set one fair rule. | 可以让玩家一起定一条公平的规则。
家庭小讨论 | Ask your family what they think about dinner, then decide together. | 问问家人晚饭怎么安排，然后一起决定。
W32
描述要从大到小 | Start with the room, then name the things in it. | 先说房间，再近到里面的东西。
用 near 和 on | Words like near and on make a place clear. | 用“附近”和“在…上面”，地点会更清楚。
多说一件物品 | Adding one more detail helps a listener make a picture. | 多说一个细节，听的人更好想象。
喜欢也可以成为描述 | “I like this room” tells how a place feels. | “我喜欢这个房间”说出了这个地方的感觉。
按描述去找 | A good description should help a friend find the thing. | 好的描述，要能帮助朋友找到东西。
关卡说明要能对上图 | Room text and the map should match. | 房间的说明和地图要一致。
描述一间屋 | Describe your room in three short English sentences. | 用三句短英语描述你的房间。
W33
先看再行动 | Looking first is a smart team verb. | 先看再行动，是聪明的小队做法。
不要着急 | “Don’t rush” keeps the team safe and clear. | “不要着急”能让小队更安全、更清楚。
再检查一次很值 | A second check can catch a missed step. | 再检查一次，可能发现漏掉的步骤。
一起移动 | Move only when the team is ready to move. | 等大家都准备好了，再一起移动。
动词要说给大家听 | Plan words like wait, look, and check should be said out loud. | 像等、看和检查这样的词，要说出来。
关卡动作要明确 | Players should know if they need to look, wait, or walk. | 玩家应知道此时该看、该等，还是该走。
选三个动作 | Pick three action words and use them in a tiny home plan. | 选三个动作词，用在一个小小的家里计划里。
W34
起点要一眼看到 | Players should find the start in one look. | 玩家应该一眼就能找到起点。
路要清楚 | A clear path is a kind design choice. | 把路画清楚，是一种友善的设计。
地标帮助记忆 | One strong landmark is better than ten tiny marks. | 一个鲜明的地标，比十个很小的记号更好。
公平比很难更重要 | A fair level feels good to finish. | 一个公平的关卡，让人完成时会很高兴。
少即是多 | Don’t add things that don’t help the player. | 不要加入对玩家没有帮助的东西。
先纸上设计 | Sketch the level on paper before you make it fancy. | 先在纸上画出关卡，再去装饰。
画一个迷你关卡 | Draw a start, a path, a landmark, and an end. | 画一个起点、一条路、一个地标和一个终点。
W35
先做简单版 | Make a simple version first, then add details. | 先做简单的一版，再加细节。
请朋友试玩 | A friend can show you what is confusing. | 朋友能告诉你哪里让人看不懂。
太难就要改 | If it’s too hard, changing it is good design, not failure. | 如果太难，去修改是好设计，不是失败。
一次只改一处 | Change one part, then test again. | 一次改一个地方，然后再试。
听试玩意见 | Listen to the tester; they are helping your game. | 认真听试玩的人，他们是在帮助你的游戏。
完成比完美更先 | A finished simple level is better than an unfinished big one. | 做一个完成的简单关卡，比做一个没做完的大关卡更好。
改一个小地方 | Look at a drawing you made and improve one part. | 看看你画过的一张图，只改进其中一个部分。
W36
要东西要用请 | “Please” turns a request into teamwork. | 加上“请”，请求就变成了合作。
给的时候也要清楚 | “Here you are” makes the hand-off clear. | 说“给你”，交接会更清楚。
借用要先问 | Borrowing is okay when you ask first. | 只要先问过，借用就是可以的。
用完要归还 | Give the item back so the owner can use it again. | 用完要还，主人才可以再使用。
拒绝也可以礼貌 | If you cannot share now, say so kindly. | 如果现在不能分享，也可以温柔地说明。
道具交换要明确 | In a game, show which items can be shared. | 在游戏里，要说明哪些道具可以分享。
练习礼貌要东西 | Ask for a pencil with “please” and return it with thanks. | 用“请”要一支铅笔，还的时候说谢谢。
W37
用过去时讲回顾 | “We walked” and “we helped” tell what already happened. | “我们走了”“我们帮助了”是在讲已经发生的事。
回顾能让小队成长 | Talking about what you did helps the next plan. | 谈谈刚才做了什么，对下一步计划有帮助。
先讲一件事 | Start with one clear past action. | 先讲一件清楚的过去的事情。
可以说出感受 | “It was a good plan” shares a feeling about the past. | “那是个好计划”是在分享对过去的感受。
诚实回顾 | If something was hard, you can say that too. | 如果有些事很难，也可以说出来。
游戏也可以有回顾画面 | A short recap at the end of a level feels satisfying. | 关卡结束时做一个短回顾，会让人很有收获。
讲今天做过的事 | Tell one thing you already did today in English. | 用英语讲一件你今天已经做过的事。
W38
先把故事听完 | Don’t jump in before the story ends. | 故事结束前，先不要插话。
记住开头很重要 | “What happened first?” is a strong listening question. | “一开始发生了什么？”是很好的听力问题。
你也可以当讲述人 | Retelling a story helps you remember the words. | 复述故事，能帮助你记住这些词。
好故事有地点 | A story is easier to follow when it has places. | 有地点的故事，更容易听懂。
听的人要给反应 | A nod or “that was a good story” encourages the speaker. | 点头或说“那是个好故事”，能鼓励讲述的人。
关卡也可以像故事 | A beginning, a middle, and an end make a level feel complete. | 有开头、中间和结尾，关卡会更完整。
讲一个四句故事 | Tell a four-sentence story about a walk to the yard. | 讲一个四句话的小故事，内容是走到院子。
W39
五步也不要太长 | Five short steps can still be a simple plan. | 五个短步骤，仍然可以是简单的计划。
目标先说清楚 | Everyone should know the goal before step one. | 在第一步之前，每个人都该知道目标。
计划里加上互助 | “We help each other” belongs in many good plans. | “我们互相帮助”可以写进很多好计划里。
说慢一点才能跟上 | A five-step plan needs a slow, clear voice. | 五步计划需要慢而清楚的声音。
全员都要知道计划 | Don’t keep the five steps in only one person’s head. | 不要把五个步骤只留在一个人的脑子里。
把五步画成格子 | Five boxes on paper can guide a whole level. | 纸上五个格子，就能引导整个关卡。
写五步作业计划 | Make a five-step plan for a short homework session. | 为一次短作业做一个五步计划。
W40
对话要轮流 | Taking turns keeps a talk fair. | 轮流说，对话才会公平。
先听是一种礼貌 | Listening first helps you give a better answer. | 先听，能让你的回答更好。
一次说一句 | In a short dialogue, one clear sentence is enough. | 在短对话里，一句清楚的话就够了。
回答要让人听得懂 | A clear answer is better than a long one. | 清楚的回答，比很长的回答更好。
四人也可以轮流 | A team of four can talk in a circle. | 四人小队可以围成一圈轮流说。
游戏对话不要太密 | Leave space for the player to answer. | 要给玩家留出回答的空间。
进行四轮对话 | Have a four-turn talk with a family member about your day. | 和家人就今天的事情，进行四轮对话。
W41
礼貌让路更顺畅 | “After you” keeps a doorway calm. | 说“你先请”，门口会更从容。
借过要出声 | A quiet “excuse me” is better than a push. | 轻轻说“借过”，比推挤更好。
请求加 please | Polite words make help easier to give. | 礼貌的话，让别人更愿意帮忙。
合作结束也要感谢 | Thank the team when the work is done. | 事情做完时，也要谢谢小队。
礼貌不是软弱 | Being polite is a strong team skill. | 有礼貌，是很重要的小队能力。
角色也可以很有礼 | A kind character can still be brave and clear. | 有礼貌的角色，仍然可以勇敢、清楚。
今天多用请和谢谢 | Use please and thank you at least three times today. | 今天至少说三次“请”和“谢谢”。
W42
展示前先整理图 | Make sure your map is easy to see. | 先确保你的地图容易看清。
从记号讲起 | Explain what each mark means. | 说明每个记号代表什么。
欢迎提问 | Questions mean your listener is trying to understand. | 有人提问，说明对方在努力听懂。
可以再讲一遍 | Explaining again is helpful, not a failure. | 再讲一遍是在帮助别人，不是失败。
手指跟着讲解走 | Point to the part you are talking about. | 讲到哪里，手指就指到哪里。
给地图加图例 | A small key on the map helps other people read it. | 地图上的小图例，能帮助别人看懂。
讲解一张小图 | Show a simple drawing and explain two marks on it. | 拿出一张简单的画，讲解上面的两个记号。
W43
规则要少而清 | A few clear rules are better than many hidden ones. | 少量清楚的规则，比很多隐含的规则更好。
先讲最重要的一条 | Start with the rule that keeps the team together. | 先讲那条能让小队待在一起的规则。
说明规则的原因 | People follow a rule better when they know why it exists. | 知道为什么有这条规则，人们会更愿意遵守。
允许提问 | Leave time for questions after you explain a rule. | 讲完规则后，留出提问的时间。
规则对每个人一样 | Fair rules apply to the whole team. | 公平的规则，对每个人都一样。
把规则写在关卡旁 | Show the rule near the start of the level. | 把规则写在关卡起点附近。
定一条家庭规则 | Invent one kind rule and explain why it helps. | 想出一条友善的规则，并说明它为什么有帮助。
W44
给别人指路要分步 | Give directions one step at a time. | 指路时，一次只说一步。
用地标帮助对方 | A big tree or a door is easier than only left and right. | 大树或门，往往比只说左右更容易找到。
可以陪伴走一段 | Walking with someone is the kindest direction. | 陪着走一段，是最友善的指路方式。
确定对方听懂了 | Ask if they have a question before they leave. | 对方离开前，问问还有没有问题。
从对方的位置说起 | Start from where the person is standing. | 要从对方现在站的地方说起。
游戏里的指路也要短 | Quest directions should be short and visual. | 任务里的指路，应该短，并且能看见图。
给家人指路 | Guide a family member to a room using one landmark. | 用一个地标，给家人指到某个房间。
W45
听简报时要专心 | Ready to listen means eyes and ears are on the speaker. | 准备好听，就是眼睛和耳朵都对着说话的人。
只分享一句也可以 | One good sentence can be enough. | 一句好的话，也可以很足够。
分享想法要轮流 | Let each person give one idea. | 让每个人都分享一个想法。
听完要致谢 | Thank people for listening; it takes care too. | 谢谢别人倾听，因为倾听也需要用心。
简报后立刻说一句 | Saying your sentence soon helps you remember the brief. | 很快说出你的那句，能帮助你记住简报。
关卡开始可设一句台词 | A player can start a level by saying one line. | 玩家可以说一句台词来开始关卡。
准备一句分享 | Prepare one English sentence to share about your day. | 准备一句英语，分享你的一天。
W46
计划可以改 | Changing a plan is okay when new information appears. | 有新情况时，修改计划没有关系。
一次只改一步 | Don’t throw away the whole plan if one step fails. | 如果只是一步不行，不必丢掉整个计划。
改了要告诉大家 | A new plan must be shared with the team. | 新计划必须告诉整个小队。
新计划也可以很好 | “A new plan is okay” keeps the team calm. | 说“换新计划也可以”，能让小队保持冷静。
改完再检查 | After you change it, say the new steps out loud. | 改完以后，再把新步骤大声说一遍。
试玩后就要愿意改 | Designers improve games by changing weak parts. | 设计者改掉不好的部分，游戏才会更好。
改一个小计划 | Change one step in a plan you made earlier this week. | 把你这周做过的一个计划，只改其中一步。
W47
介绍角色先报名和任务 | Say your name and your job first. | 先说你的名字，再说你的任务。
问别人做什么 | Asking “What is your job?” shows respect. | 问“你的工作是什么？”是一种尊重。
任务可以轮换 | Switching jobs later helps everyone learn. | 稍后轮换任务，能帮助每个人学习。
向导要让路变清楚 | A guide’s job is to make the way clear, not to rush. | 向导的任务是让路更清楚，而不是催促。
介绍要短 | A short intro is easier to remember. | 简短的介绍更容易记住。
角色介绍可写在卡片上 | A character intro card can start a game. | 一张角色介绍卡，就可以开始一个游戏。
介绍你自己 | Introduce yourself with your name and one job you like. | 用名字和一件你喜欢的任务来介绍自己。
W48
展示前先练习 | Practice at home so you feel ready. | 在家先练习，你会更有准备。
先告诉大家看哪里 | Tell people which part to look at first. | 先告诉大家先看哪一部分。
紧张也没有关系 | It’s okay to feel nervous before a show. | 展示前感到紧张，没有关系。
希望被喜欢也要自信 | Hope they like it, and also be proud you made it. | 希望别人喜欢，同时为自己做了它而骄傲。
时间不要太长 | A short, clear show is easier to follow. | 短而清楚的展示，更容易看懂。
作品展示像关卡发布 | Sharing your map is like sharing a new level. | 展示你的地图，就像分享一个新关卡。
做一次彩排 | Practice your show once in front of a family member. | 在家人面前彩排一次你的展示。
W49
难的地方要说出来 | Naming a hard word is the first step to learning it. | 把难词说出来，就是学会它的第一步。
慢速练习很有用 | Slow practice is still real practice. | 慢速练习，也是真正的练习。
再练一遍会更好 | Doing it again is how skills grow. | 再做一遍，本领才会增长。
进步要看见 | “I am getting better” helps you keep going. | 说“我正在进步”，能帮助你坚持下去。
专攻一个难点 | Don’t try to fix everything in one day. | 不要想在一天里把所有难点都修好。
游戏也要能重试 | A good level lets players try a hard part again. | 好的关卡会让玩家再试一次难的部分。
挑一个难句 | Choose one hard sentence and say it slowly three times. | 选一句难的话，慢慢说三遍。
W50
求助越早越好 | Ask for help before you feel stuck for too long. | 在卡住太久之前，就去求助。
陪伴本身就是帮助 | “You’re not alone” can already make a friend stronger. | 说“你不是一个人”，就已经能让朋友更有力量。
帮助后确认感觉 | Ask if they feel better, then finish the task together. | 问问对方是不是好一点了，然后一起把事情做完。
接受帮助也是能力 | Letting a friend help you is a team skill too. | 接受朋友的帮助，也是一种小队能力。
一起解决问题 | “We can fix it” keeps the focus on the problem, not on blame. | 说“我们能解决它”，是在看问题，而不是责备。
合作关卡更温暖 | Design a moment where one player needs a friend. | 可以设计一个需要朋友帮忙的时刻。
主动关心一次 | Ask someone today, “Are you okay?” and listen. | 今天主动问一句“你还好吗？”，并认真听。
W51
回顾一年的用语 | Remembering old words makes them stronger. | 记得旧的用语，它们就会更牢固。
地图、计划、帮助 | Maps, plans, and helping friends are a year’s big skills. | 地图、计划和帮助朋友，是这一年的重要本领。
为小队感到骄傲 | Being proud of the team is part of finishing well. | 为小队感到骄傲，也是一种好好结束的方式。
学过的还要继续用 | Keep using the words in real life, not only in lessons. | 要在生活里继续使用这些词，而不只在课上。
听力和开口一起进步 | A good year of practice means better ears and a braver voice. | 一年的练习，意味着听得更好，也更敢说。
回顾也能启发新设计 | Old ideas can become a new map or a new level. | 旧的想法，也可以变成新地图或新关卡。
做一张回忆卡 | Write three English words you are proud you learned. | 写下三个你为学会它们而感到骄傲的英语词。
W52
开场要沉着 | Start a report with a hello and your name. | 报告开头先问好，并报上名字。
短报告更有力 | A short, clear report is strong. | 短而清楚的报告，更有力量。
记得感谢小队 | End by thanking the team who walked with you. | 结尾时，感谢一路同行的小队。
语言会继续陪伴你 | The words you learned can still help next year. | 你学过的话，明年也还能帮到你。
结束也是新的起点 | Graduation is a start of using English on your own. | 毕业，是开始自己使用英语。
把一年做成作品集 | Keep your favorite map, character, and plan in one folder. | 把你最喜欢的地图、角色和计划放进一个文件夹。
做一次毕业回望 | Tell a family member one thing you can do now that you couldn’t last year. | 告诉家人一件你现在会、而去年还不会的事情。
'''.strip()


def _parse_phrase_line(line):
    parts = [p.strip() for p in line.split("|")]
    if len(parts) != 3:
        raise ValueError("bad phrase line: " + line)
    return tuple(parts)


def parse_extras():
    weeks = []
    blocks = []
    cur = []
    for line in EXTRAS_RAW.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith("W") and line[1:].isdigit() and len(line) == 3:
            if cur:
                blocks.append(cur)
            cur = [line]
        else:
            cur.append(line)
    if cur:
        blocks.append(cur)
    if len(blocks) != 52:
        raise ValueError("expected 52 extra blocks, got %s" % len(blocks))
    for i, block in enumerate(blocks, 1):
        head = block[0]
        if head != "W%02d" % i:
            raise ValueError("expected %s, got %s" % ("W%02d" % i, head))
        body = block[1:]
        if "---" not in body:
            raise ValueError("missing --- in " + head)
        idx = body.index("---")
        day = [_parse_phrase_line(x) for x in body[:idx]]
        sat = [_parse_phrase_line(x) for x in body[idx + 1:]]
        if len(day) != 4 or len(sat) != 2:
            raise ValueError("%s counts day=%s sat=%s" % (head, len(day), len(sat)))
        weeks.append({"day": day, "sat": sat})
    return weeks


def parse_tips():
    weeks = []
    blocks = []
    cur = []
    for line in TIPS_RAW.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith("W") and line[1:].isdigit() and len(line) == 3:
            if cur:
                blocks.append(cur)
            cur = [line]
        else:
            cur.append(line)
    if cur:
        blocks.append(cur)
    if len(blocks) != 52:
        raise ValueError("expected 52 tip blocks, got %s" % len(blocks))
    for i, block in enumerate(blocks, 1):
        head = block[0]
        if head != "W%02d" % i:
            raise ValueError("expected %s, got %s" % ("W%02d" % i, head))
        tips = []
        for line in block[1:]:
            parts = [p.strip() for p in line.split("|")]
            if len(parts) != 3:
                raise ValueError("bad tip line: " + line)
            tips.append({"titleZh": parts[0], "en": parts[1], "zh": parts[2]})
        if len(tips) != 7:
            raise ValueError("%s has %s tips" % (head, len(tips)))
        weeks.append(tips)
    return weeks


WEEK_EXTRAS = parse_extras()
WEEK_TIPS = parse_tips()

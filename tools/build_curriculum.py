# -*- coding: utf-8 -*-
"""Generate data/curriculum.json for 小队电台英语 (52 weeks x 7 days)."""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from course_extras import WEEK_EXTRAS, WEEK_TIPS

DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
DAY_ZH = {"mon": "周一", "tue": "周二", "wed": "周三", "thu": "周四", "fri": "周五", "sat": "周六", "sun": "周日"}

# Each week: title_zh, six (en, zh, cue) phrases, sat title, map steps (en, zh, place)
# Places: start, left, right, door, table, radio, window, yard, team, bag
WEEKS = [
  ("认识小队", [
    ("Hello.", "你好。", "挥手"),
    ("My name is Simba.", "我叫 Simba。", "指向自己"),
    ("I'm ready.", "我准备好了。", "举手"),
    ("We are a team.", "我们是一个小队。", "三人站一起"),
    ("Nice to meet you.", "很高兴认识你。", "微笑点头"),
    ("Let's go together.", "我们一起走吧。", "招手前进"),
  ], "第一次集合", [
    ("Hello, team.", "你好，小队。", "team"),
    ("I'm ready.", "我准备好了。", "start"),
    ("Let's go together.", "我们一起走吧。", "yard"),
  ]),
  ("数字与队伍", [
    ("I see one door.", "我看见一扇门。", "一扇门"),
    ("I see two bags.", "我看见两个包。", "两个背包"),
    ("We are a team of four.", "我们是四人小队。", "四个人"),
    ("Count with me.", "跟我一起数。", "举手报数"),
    ("Three friends are here.", "三个朋友在这里。", "三位队员"),
    ("This is our team.", "这是我们的小队。", "小队旗帜"),
  ], "数一数", [
    ("Go to the door.", "走到门那里。", "door"),
    ("I see one door.", "我看见一扇门。", "door"),
    ("Go to the bag.", "走到背包那里。", "bag"),
  ]),
  ("出发用语", [
    ("I'm ready.", "我准备好了。", "举手"),
    ("Wait.", "等一下。", "掌心向前"),
    ("This way.", "走这边。", "指向左门"),
    ("Let's start.", "我们开始吧。", "踏出一步"),
    ("Stop, please.", "请停一下。", "停下脚步"),
    ("Come with me.", "跟我来。", "回头招手"),
  ], "出发信号练习", [
    ("Wait.", "等一下。", "start"),
    ("This way.", "走这边。", "left"),
    ("I'm ready.", "我准备好了。", "door"),
  ]),
  ("方向", [
    ("Go left.", "向左走。", "向左箭头"),
    ("Go right.", "向右走。", "向右箭头"),
    ("Go up.", "向上走。", "向上箭头"),
    ("Go down.", "向下走。", "向下箭头"),
    ("Turn around.", "转过身。", "转身"),
    ("It's this way.", "是这边。", "指向道路"),
  ], "方向练习", [
    ("Go left.", "向左走。", "left"),
    ("Go right.", "向右走。", "right"),
    ("Stop at the door.", "在门口停下。", "door"),
  ]),
  ("地图里的东西", [
    ("This is a map.", "这是一张地图。", "地图"),
    ("This is the door.", "这是门。", "门"),
    ("This is the window.", "这是窗户。", "窗户"),
    ("This is the table.", "这是桌子。", "桌子"),
    ("This is the radio.", "这是对讲机。", "对讲机"),
    ("Where is the door?", "门在哪里？", "四处看"),
  ], "找到地图上的东西", [
    ("Go to the window.", "走到窗户那里。", "window"),
    ("Go to the table.", "走到桌子那里。", "table"),
    ("The radio is on the table.", "对讲机在桌子上。", "radio"),
  ]),
  ("颜色与装备", [
    ("This is my backpack.", "这是我的背包。", "背包"),
    ("These are my boots.", "这是我的靴子。", "靴子"),
    ("This is a flashlight.", "这是手电筒。", "手电筒"),
    ("I have a red bag.", "我有一个红包。", "红色包"),
    ("The map is blue.", "地图是蓝色的。", "蓝色地图"),
    ("Please take the bag.", "请拿上包。", "递过背包"),
  ], "带上装备", [
    ("Go to the bag.", "走到背包那里。", "bag"),
    ("This is my backpack.", "这是我的背包。", "bag"),
    ("Go to the table.", "走到桌子那里。", "table"),
  ]),
  ("看得见与看不见", [
    ("I can see the door.", "我看得见门。", "看着门"),
    ("I can't see the radio.", "我看不见对讲机。", "张望"),
    ("Can you see it?", "你看见了吗？", "询问"),
    ("Look over there.", "看那边。", "指向远方"),
    ("It's here.", "它在这里。", "指向近处"),
    ("I see it now.", "我现在看见了。", "点头"),
  ], "找一找", [
    ("Look over there.", "看那边。", "window"),
    ("I can see the door.", "我看得见门。", "door"),
    ("I see it now.", "我现在看见了。", "radio"),
  ]),
  ("请求帮助", [
    ("Help.", "帮忙。", "举手求助"),
    ("I need help.", "我需要帮助。", "伸手"),
    ("Are you okay?", "你还好吗？", "关切地看"),
    ("Can you help me?", "你能帮我吗？", "询问"),
    ("I'm okay.", "我没事。", "点头"),
    ("Thank you for your help.", "谢谢你的帮助。", "鞠躬致谢"),
  ], "互助任务", [
    ("I need help.", "我需要帮助。", "team"),
    ("Can you help me?", "你能帮我吗？", "bag"),
    ("Thank you for your help.", "谢谢你的帮助。", "start"),
  ]),
  ("表扬与感谢", [
    ("Good job.", "做得好。", "竖起拇指"),
    ("Nice work.", "干得漂亮。", "鼓掌"),
    ("Thank you.", "谢谢你。", "点头"),
    ("You're welcome.", "不客气。", "微笑"),
    ("Well done, team.", "小队做得好。", "给队员点赞"),
    ("I like your idea.", "我喜欢你的主意。", "点头称赞"),
  ], "给队友打气", [
    ("Go to the team.", "走到小队那里。", "team"),
    ("Good job.", "做得好。", "team"),
    ("Thank you.", "谢谢你。", "start"),
  ]),
  ("听与静", [
    ("Listen.", "听。", "手放耳边"),
    ("I hear the radio.", "我听到对讲机了。", "对讲机"),
    ("It's quiet.", "很安静。", "轻轻指唇"),
    ("Be quiet, please.", "请安静。", "轻声"),
    ("I can hear you.", "我能听见你。", "点头"),
    ("What do you hear?", "你听到了什么？", "侧耳"),
  ], "听对讲机", [
    ("Listen.", "听。", "start"),
    ("Go to the radio.", "走到对讲机那里。", "radio"),
    ("I hear the radio.", "我听到对讲机了。", "radio"),
  ]),
  ("一起行走", [
    ("Slow down.", "慢一点。", "放慢脚步"),
    ("Stay together.", "大家一起走。", "并肩走"),
    ("Follow me.", "跟我来。", "在前带路"),
    ("Don't run.", "不要跑。", "摆手"),
    ("Walk this way.", "走这条路。", "指路"),
    ("We walk together.", "我们一起走。", "手拉手"),
  ], "一起走过院子", [
    ("Follow me.", "跟我来。", "yard"),
    ("Slow down.", "慢一点。", "left"),
    ("Stay together.", "大家一起走。", "door"),
  ]),
  ("营地小对话", [
    ("Are you ready?", "你准备好了吗？", "询问"),
    ("Yes, I am ready.", "是的，我准备好了。", "点头"),
    ("What do we need?", "我们需要什么？", "摊手"),
    ("We need the map.", "我们需要地图。", "举起地图"),
    ("After you.", "你先请。", "让路"),
    ("See you at the door.", "门口见。", "挥手"),
  ], "门口集合", [
    ("Are you ready?", "你准备好了吗？", "start"),
    ("We need the map.", "我们需要地图。", "table"),
    ("See you at the door.", "门口见。", "door"),
  ]),
  ("第一次对讲", [
    ("Radio check.", "对讲机检查。", "按对讲机"),
    ("Can you hear me?", "你能听见我吗？", "对着话筒"),
    ("I hear you.", "我听见你了。", "点头"),
    ("Over.", "完毕。", "松开按键"),
    ("Please say it again.", "请再说一遍。", "再次倾听"),
    ("Loud and clear.", "又清楚又响亮。", "竖起拇指"),
  ], "第一次电台检查", [
    ("Go to the radio.", "走到对讲机那里。", "radio"),
    ("Radio check.", "对讲机检查。", "radio"),
    ("Can you hear me?", "你能听见我吗？", "team"),
  ]),
  # Phase 2
  ("小队角色", [
    ("I am the scout.", "我是侦察员。", "望向前方"),
    ("I am the helper.", "我是帮手。", "伸出援手"),
    ("You are the leader.", "你是队长。", "指向队友"),
    ("Who are you?", "你是谁？", "询问"),
    ("I can help the team.", "我能帮助小队。", "拍胸"),
    ("We each have a job.", "我们各有分工。", "四人站位"),
  ], "认一认角色", [
    ("Go to the team.", "走到小队那里。", "team"),
    ("I am the scout.", "我是侦察员。", "yard"),
    ("I am the helper.", "我是帮手。", "bag"),
  ]),
  ("对讲机呼叫", [
    ("Can you hear me?", "你能听见我吗？", "对讲"),
    ("I hear you.", "我听见你了。", "点头"),
    ("Over.", "完毕。", "松手"),
    ("This is Simba.", "我是 Simba。", "自报姓名"),
    ("Please wait.", "请等一下。", "掌心向前"),
    ("I copy that.", "收到。", "点头确认"),
  ], "呼叫队友", [
    ("Go to the radio.", "走到对讲机那里。", "radio"),
    ("This is Simba.", "我是 Simba。", "radio"),
    ("I copy that.", "收到。", "team"),
  ]),
  ("装备点验", [
    ("I have a backpack.", "我有一个背包。", "背包"),
    ("I have a map.", "我有一张地图。", "地图"),
    ("I have a radio.", "我有对讲机。", "对讲机"),
    ("I have a flashlight.", "我有手电筒。", "手电筒"),
    ("I need water.", "我需要水。", "水瓶"),
    ("Here is the first-aid kit.", "这是急救包。", "急救包"),
  ], "出发前点验", [
    ("Go to the bag.", "走到背包那里。", "bag"),
    ("I have a backpack.", "我有一个背包。", "bag"),
    ("Go to the table.", "走到桌子那里。", "table"),
  ]),
  ("东西在哪里", [
    ("Where is the radio?", "对讲机在哪里？", "张望"),
    ("It's on the left.", "它在左边。", "向左指"),
    ("It's on the right.", "它在右边。", "向右指"),
    ("It's on the table.", "它在桌子上。", "桌子"),
    ("It's near the door.", "它在门附近。", "门口"),
    ("I found it.", "我找到了。", "举起物品"),
  ], "对讲机在哪里", [
    ("Where is the radio?", "对讲机在哪里？", "start"),
    ("It's on the left.", "它在左边。", "left"),
    ("It's on the table.", "它在桌子上。", "table"),
  ]),
  ("去某个地方", [
    ("Let's go to the door.", "我们去门口吧。", "走向门"),
    ("Let's go to the yard.", "我们去院子吧。", "走向院子"),
    ("Let's go to the table.", "我们去桌子那里吧。", "走向桌子"),
    ("Meet me at the window.", "在窗户边和我见面。", "窗户"),
    ("I'll wait here.", "我在这里等。", "原地等"),
    ("We are here.", "我们到了。", "站定"),
  ], "按路线走", [
    ("Let's go to the yard.", "我们去院子吧。", "yard"),
    ("Let's go to the door.", "我们去门口吧。", "door"),
    ("We are here.", "我们到了。", "door"),
  ]),
  ("位置呼叫", [
    ("On my left.", "在我左边。", "左侧"),
    ("On my right.", "在我右边。", "右侧"),
    ("Behind us.", "在我们后面。", "回头看"),
    ("In front.", "在前面。", "向前看"),
    ("Next to the door.", "在门旁边。", "门旁"),
    ("I am at the table.", "我在桌子旁边。", "桌子旁"),
  ], "报位置", [
    ("Go left.", "向左走。", "left"),
    ("On my left.", "在我左边。", "left"),
    ("I am at the table.", "我在桌子旁边。", "table"),
  ]),
  ("简单计划", [
    ("First we go left.", "我们先向左走。", "先向左"),
    ("Then we wait.", "然后我们等一等。", "等待"),
    ("Next we check the map.", "接着我们看地图。", "看地图"),
    ("After that, we go in.", "然后我们进去。", "进门"),
    ("That's the plan.", "这就是计划。", "点头"),
    ("Are you with me?", "你跟我一起吗？", "询问"),
  ], "执行三步计划", [
    ("First we go left.", "我们先向左走。", "left"),
    ("Then we wait.", "然后我们等一等。", "door"),
    ("Next we check the map.", "接着我们看地图。", "table"),
  ]),
  ("找到与找不到", [
    ("I found the map.", "我找到地图了。", "举起地图"),
    ("I lost the radio.", "我把对讲机弄丢了。", "空着手"),
    ("Let's look again.", "我们再找找。", "搜寻"),
    ("It's not here.", "它不在这里。", "摇头"),
    ("Keep looking.", "继续找。", "鼓励"),
    ("Here it is!", "在这儿呢！", "发现"),
  ], "再找一次", [
    ("Let's look again.", "我们再找找。", "window"),
    ("It's not here.", "它不在这里。", "yard"),
    ("I found the map.", "我找到地图了。", "table"),
  ]),
  ("光线与时间", [
    ("It's dark.", "天黑了。", "天色暗"),
    ("We need the flashlight.", "我们需要手电筒。", "打开手电"),
    ("It's morning.", "现在是早上。", "晨光"),
    ("It's afternoon.", "现在是下午。", "午后"),
    ("Turn on the light.", "把灯打开。", "开灯"),
    ("Now I can see.", "现在我看得见了。", "看清路"),
  ], "天黑了", [
    ("It's dark.", "天黑了。", "window"),
    ("We need the flashlight.", "我们需要手电筒。", "bag"),
    ("Now I can see.", "现在我看得见了。", "door"),
  ]),
  ("状态与休整", [
    ("I'm tired.", "我累了。", "坐下"),
    ("I'm okay.", "我没事。", "点头"),
    ("Let's rest.", "我们休息一下。", "歇脚"),
    ("I need water.", "我需要喝水。", "水瓶"),
    ("I feel better.", "我感觉好多了。", "站起来"),
    ("Let's go on.", "我们继续走吧。", "再出发"),
  ], "休息一下", [
    ("Let's rest.", "我们休息一下。", "table"),
    ("I need water.", "我需要喝水。", "bag"),
    ("Let's go on.", "我们继续走吧。", "door"),
  ]),
  ("设计词：角色", [
    ("This is my character.", "这是我的角色。", "角色卡"),
    ("He has a backpack.", "他有一个背包。", "角色背着包"),
    ("She is a scout.", "她是侦察员。", "角色望远"),
    ("My character is careful.", "我的角色很小心。", "小心走路"),
    ("He is brave.", "他很勇敢。", "挺胸"),
    ("I made this character.", "这个角色是我做的。", "展示画"),
  ], "展示角色", [
    ("Go to the table.", "走到桌子那里。", "table"),
    ("This is my character.", "这是我的角色。", "table"),
    ("He has a backpack.", "他有一个背包。", "bag"),
  ]),
  ("设计词：地图", [
    ("This is my map.", "这是我的地图。", "自绘地图"),
    ("Here is the start.", "这里是起点。", "起点"),
    ("Here is the door.", "这里是门。", "门的位置"),
    ("The house is here.", "房子在这里。", "房子"),
    ("There is a river.", "这里有一条河。", "河流"),
    ("The path is short.", "这条路很短。", "短路线"),
  ], "走自己的地图", [
    ("Here is the start.", "这里是起点。", "start"),
    ("Here is the door.", "这里是门。", "door"),
    ("This is my map.", "这是我的地图。", "table"),
  ]),
  ("三步计划复习", [
    ("First we check the map.", "我们先看地图。", "看地图"),
    ("Then we go left.", "然后向左走。", "向左"),
    ("We stay together.", "我们一起走。", "并肩"),
    ("That is a good plan.", "那是个好计划。", "点头"),
    ("Let's try it.", "我们试试吧。", "出发"),
    ("We did it.", "我们做到了。", "击掌（拍手）"),
  ], "完成三步计划", [
    ("First we check the map.", "我们先看地图。", "table"),
    ("Then we go left.", "然后向左走。", "left"),
    ("We stay together.", "我们一起走。", "door"),
  ]),
  # Phase 3
  ("两句简报", [
    ("We go left.", "我们向左走。", "向左"),
    ("We wait at the door.", "我们在门口等。", "门口等候"),
    ("We take the radio.", "我们带上对讲机。", "拿起对讲机"),
    ("We check the yard.", "我们查看院子。", "看院子"),
    ("Please listen to the plan.", "请听计划。", "举手示意听"),
    ("I understand.", "我明白了。", "点头"),
  ], "按两句简报走", [
    ("We go left.", "我们向左走。", "left"),
    ("We wait at the door.", "我们在门口等。", "door"),
    ("We take the radio.", "我们带上对讲机。", "radio"),
  ]),
  ("说出原因", [
    ("We go left because it's quiet.", "我们向左走，因为那里安静。", "安静的左侧"),
    ("We wait because it's dark.", "我们等一等，因为天黑了。", "暗处等候"),
    ("We take the light because we need it.", "我们带上手电，因为我们需要它。", "手电"),
    ("Why do we stop?", "我们为什么停下？", "提问"),
    ("Because the path is wet.", "因为路是湿的。", "湿路"),
    ("That makes sense.", "这有道理。", "理解"),
  ], "因为这条路更安静", [
    ("We go left because it's quiet.", "我们向左走，因为那里安静。", "left"),
    ("Why do we stop?", "我们为什么停下？", "door"),
    ("Because the path is wet.", "因为路是湿的。", "door"),
  ]),
  ("如果与然后", [
    ("If we see the radio, we pick it up.", "如果我们看见对讲机，就把它拿起来。", "拿起"),
    ("If it's dark, we use the light.", "如果天黑了，我们就用手电。", "开手电"),
    ("If you need help, call me.", "如果你需要帮助，就叫我。", "呼叫"),
    ("If we get lost, we check the map.", "如果迷路了，我们就看地图。", "看地图"),
    ("Then we go back.", "然后我们往回走。", "折返"),
    ("I will remember.", "我会记住的。", "点头"),
  ], "如果看见对讲机", [
    ("If we see the radio, we pick it up.", "如果我们看见对讲机，就把它拿起来。", "radio"),
    ("If it's dark, we use the light.", "如果天黑了，我们就用手电。", "bag"),
    ("Then we go back.", "然后我们往回走。", "start"),
  ]),
  ("比较路线", [
    ("The left way is short.", "左边的路很短。", "短路线"),
    ("The right way is safe.", "右边的路更安全。", "安全路线"),
    ("Which way is better?", "哪条路更好？", "比较"),
    ("I think we go right.", "我觉得我们走右边。", "选择右"),
    ("The yard is closer.", "院子更近。", "近路"),
    ("Let's take the safe way.", "我们走安全的路吧。", "决定"),
  ], "选一条路", [
    ("The left way is short.", "左边的路很短。", "left"),
    ("The right way is safe.", "右边的路更安全。", "right"),
    ("Let's take the safe way.", "我们走安全的路吧。", "right"),
  ]),
  ("询问与建议", [
    ("Where should we go?", "我们该去哪里？", "问路"),
    ("I think we go left.", "我觉得我们向左走。", "建议向左"),
    ("What do you think?", "你觉得呢？", "征求意见"),
    ("I agree.", "我同意。", "点头"),
    ("I have an idea.", "我有一个主意。", "举手"),
    ("Let's decide together.", "我们一起决定吧。", "围在一起"),
  ], "一起决定", [
    ("Where should we go?", "我们该去哪里？", "start"),
    ("I think we go left.", "我觉得我们向左走。", "left"),
    ("Let's decide together.", "我们一起决定吧。", "team"),
  ]),
  ("描述房间", [
    ("The table is near the window.", "桌子在窗户附近。", "桌与窗"),
    ("The radio is on the table.", "对讲机在桌子上。", "桌上电台"),
    ("The bag is by the door.", "包在门边。", "门边的包"),
    ("The room is small.", "这个房间很小。", "小房间"),
    ("There are two windows.", "有两扇窗户。", "两扇窗"),
    ("I like this room.", "我喜欢这个房间。", "环顾"),
  ], "按描述找东西", [
    ("The bag is by the door.", "包在门边。", "door"),
    ("The table is near the window.", "桌子在窗户附近。", "window"),
    ("The radio is on the table.", "对讲机在桌子上。", "radio"),
  ]),
  ("策略动词", [
    ("Let's plan.", "我们来计划一下。", "摊开地图"),
    ("Let's wait.", "我们等一等。", "等候"),
    ("Let's check.", "我们检查一下。", "查看"),
    ("Let's stay.", "我们留在这里。", "站定"),
    ("Let's move.", "我们继续走。", "迈步"),
    ("Let's help.", "我们来帮忙。", "伸手"),
  ], "边走边做", [
    ("Let's check.", "我们检查一下。", "table"),
    ("Let's wait.", "我们等一等。", "door"),
    ("Let's move.", "我们继续走。", "yard"),
  ]),
  ("游戏设计词", [
    ("This is a level.", "这是一个关卡。", "关卡图"),
    ("This is a rule.", "这是一条规则。", "规则卡"),
    ("This is an item.", "这是一个道具。", "道具"),
    ("Press the button.", "按下按钮。", "按钮"),
    ("I hear a sound.", "我听到一种声音。", "音效"),
    ("The story starts here.", "故事从这里开始。", "起点"),
  ], "走进一个关卡", [
    ("The story starts here.", "故事从这里开始。", "start"),
    ("Press the button.", "按下按钮。", "door"),
    ("This is an item.", "这是一个道具。", "table"),
  ]),
  ("设计一个关卡", [
    ("I want a level with two doors.", "我想要一个有两扇门的关卡。", "两扇门"),
    ("There is a radio in my level.", "我的关卡里有对讲机。", "关卡中的电台"),
    ("The start is in the yard.", "起点在院子里。", "院子起点"),
    ("You need the map to go in.", "你需要地图才能进去。", "用地图开门"),
    ("The rule is: stay together.", "规则是：大家一起走。", "规则"),
    ("This is my level.", "这是我的关卡。", "展示"),
  ], "试玩自己的关卡", [
    ("The start is in the yard.", "起点在院子里。", "yard"),
    ("You need the map to go in.", "你需要地图才能进去。", "table"),
    ("I want a level with two doors.", "我想要一个有两扇门的关卡。", "door"),
  ]),
  ("向队友要东西", [
    ("I need the map.", "我需要地图。", "伸手"),
    ("Can you help me?", "你能帮我吗？", "询问"),
    ("Please pass the radio.", "请把对讲机递给我。", "递东西"),
    ("Here you are.", "给你。", "递给对方"),
    ("May I use the light?", "我可以用手电吗？", "礼貌请求"),
    ("We can share it.", "我们可以一起用。", "分享"),
  ], "互相递东西", [
    ("I need the map.", "我需要地图。", "table"),
    ("Please pass the radio.", "请把对讲机递给我。", "radio"),
    ("Here you are.", "给你。", "team"),
  ]),
  ("简单过去时", [
    ("We found the radio.", "我们找到了对讲机。", "回忆找到"),
    ("We stayed together.", "我们一直在一起。", "并肩"),
    ("We waited at the door.", "我们在门口等过。", "曾等候"),
    ("We checked the map.", "我们看过地图。", "曾看图"),
    ("It was quiet.", "当时很安静。", "回忆"),
    ("We did a good job.", "我们做得很好。", "表扬"),
  ], "回想今天走的路", [
    ("We checked the map.", "我们看过地图。", "table"),
    ("We waited at the door.", "我们在门口等过。", "door"),
    ("We found the radio.", "我们找到了对讲机。", "radio"),
  ]),
  ("较长听力故事", [
    ("Listen to the story.", "听这个故事。", "倾听"),
    ("The team went to the yard.", "小队去了院子。", "院子"),
    ("They looked for the radio.", "他们在找对讲机。", "寻找"),
    ("It was on the table.", "它在桌子上。", "桌子"),
    ("They were happy.", "他们很高兴。", "微笑"),
    ("That was the story.", "故事讲完了。", "结束"),
  ], "按故事走一遍", [
    ("The team went to the yard.", "小队去了院子。", "yard"),
    ("They looked for the radio.", "他们在找对讲机。", "table"),
    ("It was on the table.", "它在桌子上。", "radio"),
  ]),
  ("五句计划", [
    ("Our goal is the radio.", "我们的目标是对讲机。", "目标"),
    ("We go through the door.", "我们穿过这扇门。", "过门"),
    ("We go left because it's quiet.", "我们向左走，因为安静。", "原因"),
    ("We help each other.", "我们互相帮助。", "互助"),
    ("Then we go back together.", "然后我们一起回去。", "返回"),
    ("This is our plan.", "这是我们的计划。", "总结"),
  ], "执行五句计划", [
    ("We go through the door.", "我们穿过这扇门。", "door"),
    ("We go left because it's quiet.", "我们向左走，因为安静。", "left"),
    ("Our goal is the radio.", "我们的目标是对讲机。", "radio"),
  ]),
  # Phase 4
  ("四轮短对话", [
    ("Are you ready?", "你准备好了吗？", "询问"),
    ("Yes.", "是的。", "回答"),
    ("This way.", "走这边。", "指路"),
    ("Wait.", "等一下。", "停下"),
    ("Okay, let's go.", "好，我们走吧。", "再出发"),
    ("I'm with you.", "我和你一起。", "跟上"),
  ], "走一遍对话", [
    ("Are you ready?", "你准备好了吗？", "start"),
    ("This way.", "走这边。", "left"),
    ("Wait.", "等一下。", "door"),
  ]),
  ("礼貌的小队用语", [
    ("Please wait.", "请等一下。", "礼貌地停"),
    ("After you.", "你先请。", "让路"),
    ("Nice idea.", "好主意。", "称赞"),
    ("Excuse me.", "打扰一下。", "侧身"),
    ("Sorry, I was late.", "对不起，我来晚了。", "致歉"),
    ("That's all right.", "没关系。", "谅解"),
  ], "礼貌地通过门口", [
    ("Excuse me.", "打扰一下。", "start"),
    ("After you.", "你先请。", "door"),
    ("Nice idea.", "好主意。", "yard"),
  ]),
  ("讲解自己的地图", [
    ("My map has a start.", "我的地图有一个起点。", "起点"),
    ("It has a river.", "它有一条河。", "河"),
    ("It has a house.", "它有一座房子。", "房子"),
    ("The path goes left.", "路向左延伸。", "向左的路"),
    ("You start at the yard.", "你从院子出发。", "院子"),
    ("This is how my map works.", "我的地图是这样用的。", "讲解"),
  ], "按讲解走地图", [
    ("You start at the yard.", "你从院子出发。", "yard"),
    ("The path goes left.", "路向左延伸。", "left"),
    ("It has a house.", "它有一座房子。", "door"),
  ]),
  ("讲解一条规则", [
    ("In my game, you need the radio.", "在我的游戏里，你需要对讲机。", "规则与电台"),
    ("The radio opens the door.", "对讲机可以开门。", "用电台开门"),
    ("You must stay together.", "你们必须一起走。", "规则"),
    ("Do not run.", "不要跑。", "规则卡"),
    ("If you help a friend, you get a star.", "如果你帮助朋友，你会得到一颗星。", "星星"),
    ("Those are my rules.", "这些就是我的规则。", "总结"),
  ], "按规则开门", [
    ("You must stay together.", "你们必须一起走。", "team"),
    ("In my game, you need the radio.", "在我的游戏里，你需要对讲机。", "radio"),
    ("The radio opens the door.", "对讲机可以开门。", "door"),
  ]),
  ("给家长指路", [
    ("Go left.", "向左走。", "向左"),
    ("Stop at the door.", "在门口停下。", "门口"),
    ("The radio is on the table.", "对讲机在桌子上。", "桌子"),
    ("Now go to the window.", "现在去窗户那里。", "窗户"),
    ("Please follow my words.", "请按我说的走。", "讲解"),
    ("You did it!", "你做到了！", "祝贺"),
  ], "给别人指路", [
    ("Go left.", "向左走。", "left"),
    ("Stop at the door.", "在门口停下。", "door"),
    ("The radio is on the table.", "对讲机在桌子上。", "table"),
  ]),
  ("听简报并说一句", [
    ("The most important thing is the radio.", "最重要的是对讲机。", "重点"),
    ("We must stay together.", "我们必须一起走。", "重点二"),
    ("I can say it in one sentence.", "我能用一句话说出来。", "概括"),
    ("We go to the table for the radio.", "我们去桌子那里取对讲机。", "一句概括"),
    ("Did I get it right?", "我说对了吗？", "确认"),
    ("Yes, that's it.", "对，就是这样。", "肯定"),
  ], "抓住重点", [
    ("We must stay together.", "我们必须一起走。", "team"),
    ("We go to the table for the radio.", "我们去桌子那里取对讲机。", "table"),
    ("The most important thing is the radio.", "最重要的是对讲机。", "radio"),
  ]),
  ("修改计划", [
    ("This way is dark.", "这条路很暗。", "暗路"),
    ("Let's take the flashlight.", "我们带上手电吧。", "改计划"),
    ("The old plan is not safe.", "原来的计划不够安全。", "评估"),
    ("We can change the plan.", "我们可以改计划。", "修改"),
    ("A new plan is ready.", "新计划准备好了。", "新方案"),
    ("Let's try the new way.", "我们试试新的路。", "再出发"),
  ], "换一条更亮的路", [
    ("This way is dark.", "这条路很暗。", "left"),
    ("Let's take the flashlight.", "我们带上手电吧。", "bag"),
    ("Let's try the new way.", "我们试试新的路。", "right"),
  ]),
  ("角色介绍", [
    ("My character is a scout.", "我的角色是侦察员。", "介绍"),
    ("He is brave and careful.", "他又勇敢又小心。", "性格"),
    ("She helps the team.", "她帮助小队。", "作用"),
    ("He has a map and a radio.", "他有地图和对讲机。", "装备"),
    ("I want you to meet him.", "我想让你认识他。", "介绍给别人"),
    ("That's my character.", "那就是我的角色。", "收尾"),
  ], "带角色走一圈", [
    ("My character is a scout.", "我的角色是侦察员。", "yard"),
    ("He has a map and a radio.", "他有地图和对讲机。", "table"),
    ("She helps the team.", "她帮助小队。", "team"),
  ]),
  ("周末展示准备", [
    ("This is my map.", "这是我的地图。", "展示地图"),
    ("Here is the start.", "这里是起点。", "起点"),
    ("We stay together.", "我们一起走。", "规则"),
    ("Welcome to my level.", "欢迎来到我的关卡。", "欢迎"),
    ("Let me show you.", "让我示范给你看。", "带领"),
    ("Thanks for listening.", "谢谢你听我说。", "致谢"),
  ], "展示走位", [
    ("Welcome to my level.", "欢迎来到我的关卡。", "start"),
    ("Here is the start.", "这里是起点。", "start"),
    ("Let me show you.", "让我示范给你看。", "door"),
  ]),
  ("钉牢弱项", [
    ("Let's try this sentence again.", "我们再练一遍这句话。", "再练"),
    ("Please say it slowly.", "请说慢一点。", "慢速"),
    ("I can say it better.", "我能说得更好。", "进步"),
    ("One more time.", "再来一次。", "重复"),
    ("I remember it now.", "我现在记住了。", "记住"),
    ("I'm proud of me.", "我为自己感到骄傲。", "自信"),
  ], "再走一遍熟悉的路", [
    ("Please say it slowly.", "请说慢一点。", "start"),
    ("Let's try this sentence again.", "我们再练一遍这句话。", "door"),
    ("I remember it now.", "我现在记住了。", "radio"),
  ]),
  ("求助与帮助", [
    ("I need help.", "我需要帮助。", "求助"),
    ("I can help you.", "我能帮你。", "伸出援手"),
    ("Let's do it together.", "我们一起做吧。", "合作"),
    ("You're not alone.", "你不是一个人。", "陪伴"),
    ("Tell me what's wrong.", "告诉我怎么了。", "倾听"),
    ("We can fix it.", "我们能解决它。", "一起想办法"),
  ], "互相帮助", [
    ("I need help.", "我需要帮助。", "window"),
    ("I can help you.", "我能帮你。", "team"),
    ("Let's do it together.", "我们一起做吧。", "bag"),
  ]),
  ("全年听力回顾", [
    ("We learned many team words.", "我们学了很多小队用语。", "回顾"),
    ("We can read a simple map.", "我们能看懂简单的地图。", "地图"),
    ("We can make a short plan.", "我们能制定简短计划。", "计划"),
    ("We can help a friend.", "我们能帮助朋友。", "互助"),
    ("We can talk about our design.", "我们能谈论自己的设计。", "设计"),
    ("This was a good year.", "这是很好的一年。", "收束"),
  ], "年终走图", [
    ("We can read a simple map.", "我们能看懂简单的地图。", "table"),
    ("We can make a short plan.", "我们能制定简短计划。", "door"),
    ("We can help a friend.", "我们能帮助朋友。", "team"),
  ]),
  ("毕业对讲报告", [
    ("Hello, team. This is Simba.", "你好，小队。我是 Simba。", "开场"),
    ("Today I will give a short report.", "今天我要做一段简短报告。", "说明"),
    ("We stayed together all year.", "我们一整年都在一起。", "回顾"),
    ("I can say: I'm ready.", "我能说：我准备好了。", "宣言"),
    ("I can show you my map.", "我能把我的地图展示给你。", "展示"),
    ("Thank you, team. Over.", "谢谢，小队。完毕。", "结束"),
  ], "最后一次集合", [
    ("Hello, team. This is Simba.", "你好，小队。我是 Simba。", "team"),
    ("I can show you my map.", "我能把我的地图展示给你。", "table"),
    ("Thank you, team. Over.", "谢谢，小队。完毕。", "start"),
  ]),
]

assert len(WEEKS) == 52, len(WEEKS)

STICKERS = [
    "radio", "team", "boot", "map", "door", "bag", "eye", "help",
    "star", "ear", "walk", "talk", "badge",
    "scout", "call", "kit", "find", "path", "pin",
    "plan", "search", "light", "rest", "hero", "draw",
    "check",
    "brief", "why", "ifthen", "route", "ask", "room",
    "verb", "design", "level", "share", "past", "story", "five",
    "dialog", "polite", "mymap", "rule", "guide", "summary",
    "change", "intro", "show", "again", "together", "year", "grad",
]

IMAGE_RULES = [
    (r"thank you for listening|谢谢你们听", "thank"),
    (r"thank you|thanks,|谢谢|致谢|kind", "thank"),
    (r"nice to meet|很高兴认识|how are you|i'm fine|i am fine|你怎么样", "meet"),
    (r"hello, i am the guide|你好，我是向导", "roles"),
    (r"hello|你好|问好|挥手|goodbye", "hello"),
    (r"my name|i'm simba|i am simba|what is your name|我叫|叫什么名字|告诉名字", "name"),
    (r"i'm ready|i am ready|are you ready|we are ready|准备好", "ready"),
    (r"radio person|对讲员", "roles"),
    (r"the radio|a radio|this is the radio|对讲机|walkie", "radio"),
    (r"copy that|\bover\b|do you hear|i hear you|this is simba|call the team|call from|呼叫|完毕|收到", "call"),
    (r"flashlight|手电", "flashlight"),
    (r"turn on the light|把灯打开|stay in the light|有光的地方", "light"),
    (r"it's dark|getting late|天黑|天色有些晚|lantern", "lantern"),
    (r"it's morning|sun is up|太阳|it's afternoon|morning", "sun"),
    (r"red bag|红包", "bag-red"),
    (r"backpack|the bag|my bag|a bag|背包|拿上包|check the bag|ask for the bag", "bag"),
    (r"boots|靴子", "boots"),
    (r"blue map|地图是蓝", "map-blue"),
    (r"my map|this is a map|the map|check the map|have a map|use a map|看地图|一张地图|用地图|展示.*地图", "map"),
    (r"window|窗户", "window"),
    (r"table|桌子", "table"),
    (r"yard|院子", "yard"),
    (r"door|门", "door"),
    (r"go left|look left|向左|on my left|we go left|turn left|why we go left", "left"),
    (r"go right|look right|向右|on my right|turn right|on my right", "right"),
    (r"go up|向上", "up"),
    (r"go down|向下", "down"),
    (r"turn around|转过", "turn"),
    (r"this way|it's this way|走这边|which way|哪一边|哪条路|longer|shorter|更长|更短", "sign"),
    (r"wait|等一|等我|等你|等候", "wait"),
    (r"stop\b|停下|停一下", "stop"),
    (r"come with me|come to|跟我来|到院子这边来|到门这边来", "come"),
    (r"let's go together|go together|一起走|一起开始|walk together|we walked|stay together|待在一起", "go"),
    (r"follow me|walk slowly|stay close|don't run|慢慢走|靠近|go straight|一直走", "walk"),
    (r"need help|help me|help you|help a friend|帮忙|帮你|帮我|互助|求助", "help"),
    (r"don't worry|i am here for you|you are not alone|你不是一个人|我就在你身边", "friends"),
    (r"count|how many|数|five steps|five trees|four of us|三个朋友|四人|五步", "count"),
    (r"we are a team|our team|小队|teammate|this is our team|friends are here|well done, team", "team"),
    (r"this is my friend|我的朋友|new teammate", "friends"),
    (r"please come in|请进", "home"),
    (r"look over there|look carefully|look first|can you see|看得见|看不见|看那边|仔细看|先看", "look"),
    (r"i see it|found|here it is|找到|在这儿|we found", "found"),
    (r"lost|弄丢|it's not here|keep looking|再找|search|寻找|look near|look in the bag", "search"),
    (r"listen|hearing|be quiet|安静|我在听|听句子|听说明|听简报|听故事|ready to listen", "listen"),
    (r"speak slowly|say that again|your turn to talk|say it slowly|说慢", "speak"),
    (r"rest|tired|break|休息|累了", "rest"),
    (r"water|喝水|水瓶", "water"),
    (r"idea|suggestion|主意|建议", "idea"),
    (r"i agree|i understand|好主意|明白|我同意", "agree"),
    (r"what do you think|where should|any questions|你觉得|有问题吗|为什么|tell me why|what is your job", "ask"),
    (r"if we|if you|if i|如果", "plan"),
    (r"plan|计划|brief|简报|五步", "plan"),
    (r"safe way|safe path|安全的路|keeps us safe|camp is safe", "safe"),
    (r"landmark|地标|big tree|大树", "landmark"),
    (r"river|河", "bridge"),
    (r"hill|山坡", "hill"),
    (r"camp|营地", "camp"),
    (r"room|房间", "room"),
    (r"start\b|起点", "start"),
    (r"character|role|角色|侦察|guide|向导|job is|我的工作|switch jobs|每人.*任务", "roles"),
    (r"level|关卡|players need|玩家|迷你关卡", "level"),
    (r"design|draw the path|画路线|画在|先纸上", "design"),
    (r"pencil|画一个", "pencil"),
    (r"notebook|sketch|本子", "notebook"),
    (r"rule|规则", "rules"),
    (r"share|分享|take turns|轮流|fair|公平", "fair"),
    (r"story|故事", "story"),
    (r"report|报告|展示我的|give a short|讲解", "report"),
    (r"practice|练习|getting better|弱项|难词|难句|再练", "practice"),
    (r"year|全年|毕业|goodbye team|see you|proud of our team|this was a good year", "year"),
    (r"home|在家", "home"),
    (r"kit|装备|everything is here|点验|清单", "kit"),
    (r"pin|记号|mark means|图例", "pin"),
    (r"compass|指南针", "compass"),
    (r"clock|time to|有时间|注意时间", "clock"),
    (r"good job|well done|做得好|we did it|we can do this|star", "star"),
    (r"flag|旗帜", "flag"),
    (r"path is|the path|clear path|路不要|两条路", "path"),
    (r"flag|旗帜|队旗", "flag"),
    (r"compass|指南针", "compass"),
    (r"clock|watch the time|看时间|有时间", "clock"),
    (r"question mark|看起来困惑", "question"),
    (r"share the map|分享地图|share a", "share"),
    (r"notebook|笔记本|sketchbook", "notebook"),
    (r"pencil|铅笔", "pencil"),
    (r"radio is on the table|对讲机在桌子上", "table-radio"),
    (r"bag is by the door|包在门边", "bag-door"),
    (r"hill|小山|山坡", "hill"),
]

DEFAULT_IMAGE = "team"


def pick_image(*parts):
    text = " ".join("" if p is None else str(p) for p in parts)
    key = text.lower()
    for pattern, name in IMAGE_RULES:
        if re.search(pattern, key, flags=re.I):
            return f"images/{name}.webp"
    return f"images/{DEFAULT_IMAGE}.webp"


def slug(text, i):
    s = "".join(ch.lower() if ch.isalnum() else "-" for ch in text)
    s = "-".join(p for p in s.split("-") if p)[:40]
    return s or f"p{i}"


def audio_name(lesson_id, phrase_en, idx):
    return f"audio/{lesson_id}-{idx}-{slug(phrase_en, idx)}.mp3"


def make_phrase(lesson_id, en, zh, cue, idx):
    audio = audio_name(lesson_id, en, idx)
    phrase = {
        "id": f"{lesson_id}-p{idx}",
        "en": en,
        "zh": zh,
        "cue": cue,
        "image": pick_image(en, zh, cue),
    }
    # Only attach audio when the MP3 exists (week-1 demo clips); otherwise app.js falls back to TTS.
    if (Path("/workspace/simba-english-web") / audio).exists():
        phrase["audio"] = audio
    return phrase


def make_tip(lesson_id, tip):
    return {
        "id": f"{lesson_id}-tip",
        "titleZh": tip["titleZh"],
        "en": tip["en"],
        "zh": tip["zh"],
        "image": pick_image(tip["titleZh"], tip["en"], tip["zh"]),
    }


assert len(WEEK_EXTRAS) == 52
assert len(WEEK_TIPS) == 52

lessons = []
for wi, (title_zh, phrases, sat_title, steps) in enumerate(WEEKS, start=1):
    phase = 1 if wi <= 13 else 2 if wi <= 26 else 3 if wi <= 39 else 4
    sticker = STICKERS[wi - 1]
    extras = WEEK_EXTRAS[wi - 1]
    week_tips = WEEK_TIPS[wi - 1]
    # weekday sets: keep the original 3, then add 2 extras
    day_sets = [
        [0, 1, 2],
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 5],
        [0, 4, 5],
    ]
    extra_pairs = [
        (0, 1),
        (1, 2),
        (2, 3),
        (3, 0),
        (0, 2),
    ]
    day_titles = [
        f"{title_zh}（上）",
        f"{title_zh}（续）",
        f"{title_zh}（练）",
        f"{title_zh}（用）",
        f"{title_zh}（收）",
    ]
    for di, day in enumerate(DAYS[:5]):
        lid = f"p{phase}-w{wi:02d}-{day}"
        idxs = day_sets[di]
        lesson_phrases = [make_phrase(lid, *phrases[i], j) for j, i in enumerate(idxs)]
        a, b = extra_pairs[di]
        lesson_phrases.append(make_phrase(lid, *extras["day"][a], 3))
        lesson_phrases.append(make_phrase(lid, *extras["day"][b], 4))
        lessons.append({
            "id": lid,
            "phase": phase,
            "week": wi,
            "day": day,
            "dayZh": DAY_ZH[day],
            "type": "weekday",
            "titleZh": day_titles[di],
            "introZh": f"今天学五句话，大约十二到十五分钟。主题是{title_zh}。",
            "image": lesson_phrases[0]["image"],
            "phrases": lesson_phrases,
            "task": {
                "type": "tap_listen",
                "promptZh": "听到句子，点正确的那一张。",
            },
            "tip": make_tip(lid, week_tips[di]),
            "sticker": sticker,
        })
    # Saturday: keep original 3 map phrases, add 2 extras. Map steps stay the original 3.
    lid = f"p{phase}-w{wi:02d}-sat"
    sat_phrases = [make_phrase(lid, en, zh, place, j) for j, (en, zh, place) in enumerate(steps)]
    for j, extra in enumerate(extras["sat"], start=3):
        sat_phrases.append(make_phrase(lid, *extra, j))
    lessons.append({
        "id": lid,
        "phase": phase,
        "week": wi,
        "day": "sat",
        "dayZh": "周六",
        "type": "map",
        "titleZh": sat_title,
        "introZh": "今天先听五句话，再做地图任务。不打开游戏。",
        "image": pick_image(sat_title, "map", "yard"),
        "phrases": sat_phrases,
        "task": {
            "type": "map",
            "promptZh": "按听到的句子，点地图上的地点。",
            "steps": [
                {
                    **{
                        "en": en,
                        "zh": zh,
                        "place": place,
                        "image": pick_image(en, zh, place),
                    },
                    **({"audio": sat_phrases[j]["audio"]} if sat_phrases[j].get("audio") else {}),
                }
                for j, (en, zh, place) in enumerate(steps)
            ],
        },
        "tip": make_tip(lid, week_tips[5]),
        "sticker": sticker,
    })
    # Sunday review: keep original 3 (indices 0,2,5) then add week phrases 1 and 3
    lid = f"p{phase}-w{wi:02d}-sun"
    review_idx = [0, 2, 5, 1, 3]
    review = [make_phrase(lid, *phrases[i], j) for j, i in enumerate(review_idx)]
    lessons.append({
        "id": lid,
        "phase": phase,
        "week": wi,
        "day": "sun",
        "dayZh": "周日",
        "type": "review",
        "titleZh": f"{title_zh}·复习汇报",
        "introZh": "今天复习本周的五句话，再做口头汇报。",
        "image": review[0]["image"],
        "phrases": review,
        "task": {
            "type": "review_pick",
            "promptZh": "听句子，选出正确的中文意思。",
        },
        "tip": make_tip(lid, week_tips[6]),
        "sticker": "badge" if wi in (13, 26, 39, 52) else sticker,
    })

assert len(lessons) == 52 * 7

data = {
    "product": "小队电台英语",
    "version": 2,
    "cacheVersion": "simba-squad-v6",
    "learnerDefaultName": "Simba",
    "noteZh": "课文只用小队、地图、方向和沟通用语，不打开《三角洲行动》游戏。该游戏在中国区 App Store 当前为 18+。",
    "phases": [
        {"id": 1, "weeks": [1, 13], "titleZh": "入门营地"},
        {"id": 2, "weeks": [14, 26], "titleZh": "小队沟通"},
        {"id": 3, "weeks": [27, 39], "titleZh": "地图与策略"},
        {"id": 4, "weeks": [40, 52], "titleZh": "交流与解说"},
    ],
    "places": [
        {"id": "start", "zh": "起点", "x": 1, "y": 1, "image": "images/start.webp"},
        {"id": "left", "zh": "左边", "x": 0, "y": 1, "image": "images/left.webp"},
        {"id": "right", "zh": "右边", "x": 2, "y": 1, "image": "images/right.webp"},
        {"id": "yard", "zh": "院子", "x": 1, "y": 0, "image": "images/yard.webp"},
        {"id": "door", "zh": "门", "x": 0, "y": 0, "image": "images/door.webp"},
        {"id": "window", "zh": "窗户", "x": 2, "y": 0, "image": "images/window.webp"},
        {"id": "bag", "zh": "背包", "x": 0, "y": 2, "image": "images/bag.webp"},
        {"id": "table", "zh": "桌子", "x": 1, "y": 2, "image": "images/table.webp"},
        {"id": "radio", "zh": "对讲机", "x": 2, "y": 2, "image": "images/radio.webp"},
        {"id": "team", "zh": "小队", "x": 2, "y": 1, "image": "images/team.webp"},
    ],
    "lessons": lessons,
}

# Keep slug/audio_name/make_phrase if they already exist above — this tail
# replaces from the first make_phrase, so also drop the old slug if it remains
# earlier in the file. Old slug/audio_name stay before this block? We cut at
# make_phrase, so old slug() remains. Redefining slug later is fine, but
# having two slug defs is messy. Leave old slug and only start at make_phrase
# was the cut point — wait, this new_tail includes slug again. I'll cut at slug
# instead if present.

out = Path("/workspace/simba-english-web/data/curriculum.json")
out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"wrote {out} lessons={len(lessons)} bytes={out.stat().st_size}")

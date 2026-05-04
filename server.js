const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_AUTH_TOKEN || process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
});

const DIFFICULTIES = ['入门', '入门', '进阶', '烧脑', '脑筋急转弯'];

const STORY_PROMPT = `你是海龟汤大师。海龟汤是情境推理游戏：给出离奇情境（汤面），玩家通过"是/否"提问推理真相（汤底）。

## 类别风格
- 生活日常类：日常中的离奇小事（地铁、外卖、合租、邻里等）
- 悬疑犯罪类：案件、失踪、阴谋，侦探小说质感，结局出人意料
- 细思极恐类：日常细节中隐藏的恐怖感，细想后脊发凉
- 脑洞反转类：结局颠覆预设，设定新奇大胆，拍案叫绝
- 温情治愈类：表面离奇甚至惊悚，汤底温暖感人、催泪
- 沙雕搞笑类：荒诞乌龙，无厘头但逻辑自洽，笑出声

## 难度标准
- 入门：线索充分，逻辑直白，新手友好
- 进阶：需要推理和多角度思考
- 烧脑：线索隐晦，多重反转，反复推敲
- 脑筋急转弯：需要灵光一闪的顿悟，思维跳跃而非逻辑推导

## 要求
- 汤面2-4句话，抓人眼球、引发好奇
- 汤底2-4句话，解释完整、逻辑自洽、有惊喜
- 用中文
- 难度真实体现在谜题设计上，不要只标注`;

async function generateOne(topic, category, difficulty, index) {
  const prompt = `主题：「${topic}」| 类别：${category} | 难度：${difficulty}

请生成1个海龟汤。严格只返回JSON对象，不要其他内容：

{"category":"${category}","difficulty":"${difficulty}","soup":"汤面...","truth":"汤底..."}`;

  const msg = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
    max_tokens: 1024,
    temperature: 0.95,
    thinking: { type: 'disabled' },
    system: STORY_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = msg.content.find(c => c.type === 'text');
  const text = textBlock?.text;
  const fallbackText = typeof msg.content === 'string' ? msg.content : null;
  const finalText = text || fallbackText;

  if (!finalText) {
    console.error(`[${index}] API 返回空内容`);
    return null;
  }

  const jsonMatch = finalText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error(`[${index}] JSON 解析失败:`, finalText.substring(0, 200));
    return null;
  }

  return JSON.parse(jsonMatch[0]);
}

app.post('/api/generate', async (req, res) => {
  const { topic, category } = req.body;

  if (!topic || topic.trim().length === 0) {
    return res.status(400).json({ error: '请输入一个主题' });
  }

  const categoryText = category || '生活日常类';
  const topicClean = topic.trim();

  try {
    const results = await Promise.all(
      DIFFICULTIES.map((diff, i) =>
        generateOne(topicClean, categoryText, diff, i).catch(err => {
          console.error(`[${i}] 请求失败:`, err.message);
          return null;
        })
      )
    );

    const stories = results.filter(Boolean);
    if (stories.length === 0) throw new Error('所有请求均失败');

    console.log(`✅ 生成完成: ${stories.length}/5 个故事`);
    res.json({ stories, category: categoryText });
  } catch (err) {
    console.error('生成失败:', err);
    res.status(500).json({ error: '生成失败，请稍后再试' });
  }
});

app.listen(PORT, () => {
  console.log(`🐢 海龟汤生成器已就绪 → http://localhost:${PORT}`);
});

const fs = require('fs').promises;
const path = require('path');

const exhibitsPath = path.join(__dirname, '../data/exhibits.json');

const generateRandomExhibit = () => {
  const names = ['Ночной дозор', 'Крик', 'Тайная вечеря', 'Рождение Венеры', 'Сад земных наслаждений'];
  const artists = ['Рембрандт', 'Мунк', 'Леонардо да Винчи', 'Боттичелли', 'Босх'];
  const materials = ['масло', 'акрил', 'темпера', 'акварель', 'карандаш'];
  
  return {
    name: names[Math.floor(Math.random() * names.length)],
    artist: artists[Math.floor(Math.random() * artists.length)],
    year: 1800 + Math.floor(Math.random() * 223),
    isAvailable: Math.random() > 0.3,
    createdAt: new Date().toISOString(),
    materials: [materials[Math.floor(Math.random() * materials.length)]]
  };
};

const readExhibits = async () => {
  const data = await fs.readFile(exhibitsPath, 'utf8');
  return JSON.parse(data);
};

const writeExhibits = async (data) => {
  await fs.writeFile(exhibitsPath, JSON.stringify(data, null, 2));
};

module.exports = (app) => {
  app.get('/exhibits', async (req, res) => {
    try {
      const exhibits = await readExhibits();
      res.json(exhibits);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка чтения данных' });
    }
  });

  app.get('/exhibits/:id', async (req, res) => {
    try {
      const exhibits = await readExhibits();
      const exhibit = exhibits.find(e => e.id === req.params.id);
      
      if (exhibit) {
        res.json(exhibit);
      } else {
        res.status(404).json({ error: 'Экспонат не найден' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Ошибка чтения данных' });
    }
  });

  app.post('/exhibits', async (req, res) => {
    try {
      const exhibits = await readExhibits();
      const newExhibit = {
        id: String(Date.now()),
        ...(req.body && Object.keys(req.body).length > 0 ? req.body : generateRandomExhibit())
      };
      
      exhibits.push(newExhibit);
      await writeExhibits(exhibits);
      
      res.status(201).json(newExhibit);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка создания экспоната' });
    }
  });

  app.put('/exhibits/:id', async (req, res) => {
    try {
      const exhibits = await readExhibits();
      const index = exhibits.findIndex(e => e.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ error: 'Экспонат не найден' });
      }
      
      const updatedExhibit = {
        ...exhibits[index],
        ...req.body,
        id: req.params.id
      };
      
      exhibits[index] = updatedExhibit;
      await writeExhibits(exhibits);
      
      res.json(updatedExhibit);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка обновления экспоната' });
    }
  });

  app.patch('/exhibits/:id', async (req, res) => {
    try {
      const exhibits = await readExhibits();
      const index = exhibits.findIndex(e => e.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ error: 'Экспонат не найден' });
      }
      
      exhibits[index] = {
        ...exhibits[index],
        ...req.body,
        id: req.params.id
      };
      
      await writeExhibits(exhibits);
      res.json(exhibits[index]);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка обновления экспоната' });
    }
  });

  app.delete('/exhibits/:id', async (req, res) => {
    try {
      const exhibits = await readExhibits();
      const filtered = exhibits.filter(e => e.id !== req.params.id);
      
      if (filtered.length === exhibits.length) {
        return res.status(404).json({ error: 'Экспонат не найден' });
      }
      
      await writeExhibits(filtered);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка удаления экспоната' });
    }
  });
};
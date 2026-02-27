const fs = require('fs').promises;
const path = require('path');

const visitorsPath = path.join(__dirname, '../data/visitors.json');

const generateRandomVisitor = () => {
  const names = ['Петр Иванов', 'Мария Петрова', 'Сергей Сидоров', 'Елена Козлова', 'Алексей Смирнов'];
  const exhibits = ["1", "2"];
  
  return {
    name: names[Math.floor(Math.random() * names.length)],
    age: 18 + Math.floor(Math.random() * 50),
    isStudent: Math.random() > 0.5,
    visitDate: new Date().toISOString(),
    ticketNumber: 'T' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
    exhibits: [exhibits[Math.floor(Math.random() * exhibits.length)]]
  };
};

const readVisitors = async () => {
  const data = await fs.readFile(visitorsPath, 'utf8');
  return JSON.parse(data);
};

const writeVisitors = async (data) => {
  await fs.writeFile(visitorsPath, JSON.stringify(data, null, 2));
};

module.exports = (app) => {
  app.get('/visitors', async (req, res) => {
    try {
      const visitors = await readVisitors();
      res.json(visitors);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка чтения данных' });
    }
  });

  app.get('/visitors/:id', async (req, res) => {
    try {
      const visitors = await readVisitors();
      const visitor = visitors.find(v => v.id === req.params.id);
      
      if (visitor) {
        res.json(visitor);
      } else {
        res.status(404).json({ error: 'Посетитель не найден' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Ошибка чтения данных' });
    }
  });

  app.post('/visitors', async (req, res) => {
    try {
      const visitors = await readVisitors();
      const newVisitor = {
        id: String(Date.now()),
        ...(req.body && Object.keys(req.body).length > 0 ? req.body : generateRandomVisitor())
      };
      
      visitors.push(newVisitor);
      await writeVisitors(visitors);
      
      res.status(201).json(newVisitor);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка создания посетителя' });
    }
  });

  app.put('/visitors/:id', async (req, res) => {
    try {
      const visitors = await readVisitors();
      const index = visitors.findIndex(v => v.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ error: 'Посетитель не найден' });
      }
      
      const updatedVisitor = {
        ...visitors[index],
        ...req.body,
        id: req.params.id
      };
      
      visitors[index] = updatedVisitor;
      await writeVisitors(visitors);
      
      res.json(updatedVisitor);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка обновления посетителя' });
    }
  });

  app.patch('/visitors/:id', async (req, res) => {
    try {
      const visitors = await readVisitors();
      const index = visitors.findIndex(v => v.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ error: 'Посетитель не найден' });
      }
      
      visitors[index] = {
        ...visitors[index],
        ...req.body,
        id: req.params.id
      };
      
      await writeVisitors(visitors);
      res.json(visitors[index]);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка обновления посетителя' });
    }
  });

  app.delete('/visitors/:id', async (req, res) => {
    try {
      const visitors = await readVisitors();
      const filtered = visitors.filter(v => v.id !== req.params.id);
      
      if (filtered.length === visitors.length) {
        return res.status(404).json({ error: 'Посетитель не найден' });
      }
      
      await writeVisitors(filtered);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка удаления посетителя' });
    }
  });
};
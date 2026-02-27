const MiniExpress = require('./framework/miniExpress');
const bodyParser = require('./middleware/bodyParser');
const exhibitsRoutes = require('./routes/exhibitsRoutes');
const visitorsRoutes = require('./routes/visitorsRoutes');

const app = new MiniExpress();

app.use(bodyParser);

exhibitsRoutes(app);
visitorsRoutes(app);

const PORT = 3000;

app.listen(PORT);
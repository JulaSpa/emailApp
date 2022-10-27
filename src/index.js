import app from './app';

// Server Test
const port = process.env.PORT || 90;

//DB
import sequelize from './config/database'

//TEST DB
try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
   app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
      });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }






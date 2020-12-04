const express = require('express');
const path = require('path');
const config = require('config');
const createError = require('http-errors');

const app = express();

app.use(express.json({ extends: true }));

// app.get('/', async (req, res, next) => {
//   res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
// });

app.use('/api/flights', require('./routes/flights.router'));

// app.use('/', express.static('client/build'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

app.listen(config.get('port'), function() {
  console.log('Express server listening on port ' + config.get('port'));
});

const express = require('express');
router = express.Router()

exports.errorHandler = (err, req, res, next) => {
  console.log(err)
    err.statusCode = 500;
    err.status = err.status || "error";
    if (err.errno == 1062) 
      res.status(409).json({message: "Error: Duplicate entry"})
    else
      res.status(err.statusCode).json({
        status: err.status,
        message: 'MySQL error',
      });
   };
   


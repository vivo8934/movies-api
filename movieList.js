'use strict'
/////////////////module exports function/////////////////////////////
module.exports = function(models) {
  //////////////////////rendering landing pages///////////////////////
  const index = function(req, res) {
    res.render('pages/index')
  }
  ////////////////////////////////oOo//////////////////////////////////

  //////////////////reset database for new week schedule//////////////
  const reset = function(req, res, next) {
    models.waiterDays.remove({}, function(err, waiter_shifts) {
      if (err) {
        return next(err)
      } else {
        res.redirect('/days')
      }
    });
  }
  /////////////////////////////////oOo///////////////////////////////

  ///////////////////////rendering waiter screen////////////////////
  var waiterScreen = function(req, res, next) {
    var user = req.params.username;
    var waiterName = user.substring(0, 1).toUpperCase() + "" + user.substring(
      1).toLowerCase()
    models.waiterDays.findOne({
      waiter_name: waiterName
    }, {
      "days.dayName": 1,
      _id: 0
    }, function(err, daysWorking) {
      if (daysWorking) {
        var selectedDays = daysWorking.days;
        var previousWaiterDays = {};
        var lastSelection = function(waiterSelection) {
          for (var i = 0; i < selectedDays.length; i++) {
            if (previousWaiterDays[selectedDays[i].dayName] === undefined) {
              previousWaiterDays[selectedDays[i].dayName] = "checked";
            }
          }
          return previousWaiterDays
        }
        var dayList = [];
        for (var i = 0; i < selectedDays.length; i++) {
          var dy = selectedDays[i].dayName;
          if (dy) {
            dayList.push(dy)
          }
        }
        if (dayList.length !== 0) {
          lastSelection(selectedDays)
          res.render('pages/waiter', {
            msg: "Welcome back " + waiterName +
              " you previously selected this days: ",
            update: "You can change your previous selection by selecting new days to work on below",
            previousDays: dayList,
            waiterDay: previousWaiterDays,
            waiterName
          })
        }
      } else {
        res.render("pages/waiter", {
          msg: "Welcome " + waiterName,
          select: "Select three days to work on below:",
          waiterName
        })

      }
    })
  }
  /////////////////////////////////oOo//////////////////////////////////

  ////////////////////Saving and updating data to database/////////////
  var waiterdataCapture = function(req, res, next) {
    var user = req.params.username;
    var waiterName = user.substring(0, 1).toUpperCase() + "" + user.substring(
      1).toLowerCase()
    var daysWorking = req.body.day;

    if (!daysWorking) {
      req.flash('error', 'Please select days you wanna work on');
      res.redirect("/waiters/" + waiterName)
    } else {
      let days = daysWorking.map(function(day) {
        return {
          dayName: day,
          working: true
        }
      });

      var waiter_shifts = {
        waiter_name: waiterName,
        days: days
      };

      models.waiterDays.create(waiter_shifts, function(err, results) {
        if (err) {
          if (err.code === 11000) {
            var waiterName = req.params.username;
            models.waiterDays.findOne({
              waiter_name: waiter_shifts.waiter_name
            }, function(err, waiterShiftUpdate) {
              if (err) {
                return next(err)
              } else {
                waiterShiftUpdate.days = waiter_shifts.days
                waiterShiftUpdate.save()
                req.flash('success',
                  "You have successfully updated your days"
                )
                res.redirect("/waiters");
              }
            })

          }
        } else {
          var waiterName = results.waiter_name;
          res.render('pages/waiter', {
            msg: "Days added successfully",
            WaiteData: daysWorking,
            Data: waiterName + " you are woking on :",
            waiterName
          })

        }
      })
    }
  }
  ///////////////////////////////////oOo/////////////////////////////////
  function waitersForDay(day) {
    return models.waiterDays.find({
      "days.dayName": day,
      "days.working": true
    }, {
      waiter_name: 1,
      _id: 0
    })
  }
  //////////////////////geting data and display to admin view///////////
  var getWaiterData = function(req, res, next) {
    var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    var dayPromises = weekdays.map(function(day) {
      return waitersForDay(day);
    })

    Promise.all(dayPromises).then(results => {
      var monday = results[0];
      var tuesday = results[1];
      var wednesday = results[2];
      var thursday = results[3];
      var friday = results[4];
      var saturday = results[5];
      var sunday = results[6];

      var days = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];

      var colorThead = function(waiterNumber) {
        if (waiterNumber > 3) {
          return "danger"
        } else if (waiterNumber < 3) {
          return "warning"
        } else {
          return "success"
        }
      }
      var overBooked = 4;
      var underBooked = 2;
      var normallyBooked = 3;
      res.render('pages/admin', {
        days: days,
        m: monday.length,
        mThead: colorThead(monday.length),
        t: tuesday.length,
        tThead: colorThead(tuesday.length),
        w: wednesday.length,
        wThead: colorThead(wednesday.length),
        th: thursday.length,
        thThead: colorThead(thursday.length),
        f: friday.length,
        fThead: colorThead(friday.length),
        s: saturday.length,
        sThead: colorThead(saturday.length),
        su: sunday.length,
        suThead: colorThead(sunday.length),
        oV: colorThead(overBooked),
        uN: colorThead(underBooked),
        nO: colorThead(normallyBooked)
      })
    });
  }
  /////////////////////////////////oOo////////////////////////////////

  //////////returning all functions for module exports////////////////
  return {
    movies
  }
  ///////////////////////////////oOo/////////////////////////////////
}
//////////////////////////////oOo/////////////////////////////////
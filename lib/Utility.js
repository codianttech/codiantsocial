/**
 * Created by hp on 7/20/2015.
 */
!(function () {

    var Utility = {
        trim: function (input) {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            return input.replace(rtrim, '');

        },
        convertDate: function (date) {
            var targetTime = new Date(date);
            var timeZoneFromDB = -4.00; //time zone value from database
            // get the timezone offset from local time in minutes
            var tzDifference = timeZoneFromDB * 60 + targetTime.getTimezoneOffset();
            //convert the offset to milliseconds, add to targetTime, and make a new Date
            return new Date(targetTime.getTime() + tzDifference * 60 * 1000);

        }
    };
    module.exports = Utility;
})();

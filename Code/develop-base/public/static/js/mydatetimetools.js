(function($){
    $.extend({
        ms_DatePicker: function (options) {
            var defaults = {
                YearSelector: "#sel_year",
                MonthSelector: "#sel_month",
                FirstText: new Date().getFullYear(),
                FirstValue:new Date().getMonth()
            };
            var opts = $.extend({}, defaults, options);
            var $YearSelector = $(opts.YearSelector);
            var $MonthSelector = $(opts.MonthSelector);
            var FirstText = opts.FirstText;
            var FirstValue = opts.FirstValue+1;
            if(FirstValue<10){
                FirstValue = '0'+ FirstValue;
            }

            // 初始化  
            var strYear = "<option value=\"" + FirstText + "\">" + FirstText + "</option>";
            var strMonth = "<option value=\"" + FirstValue + "\">" + FirstValue + "</option>";
            $YearSelector.html(strYear);
            $MonthSelector.html(strMonth);

            // 年份列表  
            var yearNow = new Date().getFullYear();
            for (var i = yearNow-1; i >= 2010; i--) {
                var yearStr = "<option value=\"" + i + "\">" + i + "</option>";
                $YearSelector.append(yearStr);
            }

            // 月份列表  
            for (var i = 1; i <= 12; i++) {
                if(i<10){
                    i = '0'+i;
                }
                var monthStr = "<option value=\"" + i + "\">" + i + "</option>";
                $MonthSelector.append(monthStr);
            }

        }
    });
})(jQuery);
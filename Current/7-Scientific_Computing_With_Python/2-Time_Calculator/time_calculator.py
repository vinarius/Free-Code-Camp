def add_time(start, duration, dayOfWeek=None):
    # example input = "11:06 PM", "2:02"
    # getWeekDayInt('TuEsDay') # returns 2

    

    return 'foo'

def getWeekDayInt(day):
    day = day.lower()
    weekdays = ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')
    return weekdays.index(day)
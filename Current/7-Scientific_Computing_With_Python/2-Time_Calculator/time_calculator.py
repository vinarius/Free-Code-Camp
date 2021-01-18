def add_time(start, duration, dayOfWeek=None):
    # example input = "11:06 PM", "2:02"

    splitStartTime = start.split() # ['11:06', 'PM']
    currentTime = splitStartTime[0] # '11:06'
    currentSplitTime = currentTime.split(':') # ['11', '06']
    additionSplit = duration.split(':') # ['2', '02']
    amOrPm = splitStartTime[1] # 'PM'
    currentHours = int(currentSplitTime[0]) # 11
    currentMinutes = int(currentSplitTime[1]) # 06
    additionHours = int(additionSplit[0]) # 2
    additionMinutes = int(additionSplit[1]) # 2

    time = {
        'daysAdvanced': 0,
        'hours': currentHours,
        'minutes': currentMinutes,
        'amOrPm': amOrPm
    }

    print()
    print('Input:', start, duration, dayOfWeek)
    print('currentTime:', currentTime)
    print('amOrPm:', amOrPm)
    print()

    if dayOfWeek:
        print('dayOfWeek:', dayOfWeek)
        print()

    # add minutes
    # if > 59 then divide by 60 and get integer as well as remainder

    if(additionMinutes > 59):
        newHours = additionMinutes / 60
        newMinutes = additionMinutes % 60
        print('newHours:', newHours)
        print('newMinutes:', newMinutes)



    

    print()
    return 'end of function'

    

def getWeekDayInt(day):
    day = day.lower()
    weekdays = ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')
    return weekdays.index(day)
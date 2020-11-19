def add_time(start, duration, dayOfWeek=None):
    # example input = "11:06 PM", "2:02"
    # getWeekDayInt('TuEsDay') # returns 2

    splitStartTime = start.split()
    currentTime = splitStartTime[0]
    amOrPm = splitStartTime[1]
    currentSplitTime = currentTime.split(':')
    currentHours = int(currentSplitTime[0])
    currentMinutes = int(currentSplitTime[1])
    additionSplit = duration.split(':')
    additionHours = int(additionSplit[0])
    additionMinutes = int(additionSplit[1])

    print()
    print('Input:', start, duration, dayOfWeek)
    print('currentTime:', currentTime)
    print('amOrPm:', amOrPm)
    print()

    print('Minutes:')
    minutesHandler = handleMinutes(currentMinutes, additionMinutes)
    print('minutesHandler:', minutesHandler)
    print()

    if(minutesHandler['hoursAdvanced'] is not None and minutesHandler['hoursAdvanced'] > 0):
        additionHours = additionHours + minutesHandler['hoursAdvanced']

    print('Hours:')
    handleHour(currentHours, additionHours, amOrPm)

    print()
    return 0

def getWeekDayInt(day):
    day = day.lower()
    weekdays = ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')
    return weekdays.index(day)

def handleMinutes(currentMinutes, addition):
    print('currentMinutes:', currentMinutes)
    print('addition:', addition)
    result = {
        'hoursAdvanced': None,
        'currentMinutes': None
    }

    sum = currentMinutes + addition
    result['currentMinutes'] = sum

    if(sum >= 60):
        hoursCounter = 0
        while (sum >= 60):
            hoursCounter = hoursCounter + 1
            sum = sum - 60
        result['hoursAdvanced'] = hoursCounter
        result['currentMinutes'] = sum

    return result

def handleHour(currentHour, addition, amOrPm):
    print('currentHour:', currentHour)
    print('addition:', addition)
    result = {
        'daysAdvanced': None,
        'currentHour': None
    }
    hoursInADay = 24

    if (amOrPm is 'PM'):
        currentHour = currentHour + 12
        if(currentHour >)

    sum = currentHour + addition
    if (sum > hoursInADay):
        print('sum:', sum)
        print('sum % hoursInADay:', sum % hoursInADay) # 1
        print('int(sum / hoursInADay):', int(sum / hoursInADay))
    # elif (sum > 12)


    print((currentHour + addition) / hoursInADay)
    print((currentHour + addition) % hoursInADay)

    return 0
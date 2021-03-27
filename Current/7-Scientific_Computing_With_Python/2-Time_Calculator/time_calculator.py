import math

def add_time(start, duration, dayOfWeek=None):
    # example input = "11:06 PM", "2:02"
    # expected result = "1:08 AM"

    splitStartTime = start.split() # ['11:06', 'PM']
    currentTime = splitStartTime[0] # '11:06'
    currentSplitTime = currentTime.split(':') # ['11', '06']
    additionSplit = duration.split(':') # ['2', '02']
    period = splitStartTime[1] # 'PM'
    currentHours = int(currentSplitTime[0]) # 11
    currentMinutes = int(currentSplitTime[1]) # 6
    additionHours = int(additionSplit[0]) # 2
    additionMinutes = int(additionSplit[1]) # 2

    print()
    print('-------------------------')

    print()
    print('Start:', start)
    print('Duration:', duration)
    print('Day of week:', dayOfWeek)
    print()

    isAm = True if period == 'AM' else False

    # get new minutes
    # divide by 60 and get integer as well as remainder

    newHours = math.floor(additionMinutes / 60)
    newMinutes = additionMinutes % 60

    #add hours
    newHours = newHours + additionHours

    print('newHours:', newHours)
    print('newMinutes:', newMinutes)
    
    # consolidate minutes
    consolidatedMinutes = currentMinutes + newMinutes
    if(consolidatedMinutes >= 60):
        hoursCounter = math.floor(consolidatedMinutes / 60)
        newHours = newHours + hoursCounter
        consolidatedMinutes = consolidatedMinutes % 60

    # consolidate hours
    # divide by 24 to get daysAdvanced+
    # add remainder

    daysAdvanced = math.floor(newHours / 24)
    remainingHours = newHours % 24
    
    while remainingHours > 0:
        currentHours = currentHours + 1
        remainingHours = remainingHours - 1
        if currentHours == 12:
            if isAm == False:
                daysAdvanced = daysAdvanced + 1
            isAm = not isAm

        if currentHours == 13:
            currentHours = 1

    print()
    print('daysAdvanced:', daysAdvanced)
    print('remainingHours:', remainingHours)
    print('currentHours:', currentHours)
    print('consolidatedMinutes:', consolidatedMinutes)
    print('isAm:', isAm)

    period = 'AM' if isAm == True else 'PM'
    if consolidatedMinutes < 10:
        consolidatedMinutes = f'0{consolidatedMinutes}'

    result = f'{currentHours}:{consolidatedMinutes} {period}'

    if dayOfWeek != None:
        weekDayInt = getWeekDayInt(dayOfWeek)
        newDayInt = (weekDayInt + daysAdvanced) % 7
        print('newDayInt:', newDayInt)
        newDay = getWeekDayByInt(newDayInt)
        result = f'{result}, {newDay}'

    if daysAdvanced == 1:
        result = f'{result} (next day)'

    if daysAdvanced > 1:
        result = f'{result} ({daysAdvanced} days later)'

    print()
    print('Result:', result)

    

    print()
    return result


def getWeekDayInt(day):
    day = day.lower()
    weekdays = ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')
    return weekdays.index(day)

def getWeekDayByInt(weekDayInt):
    if weekDayInt == 0:
        return 'Sunday'
    if weekDayInt == 1:
        return 'Monday'
    if weekDayInt == 2:
        return 'Tuesday'
    if weekDayInt == 3:
        return 'Wednesday'
    if weekDayInt == 4:
        return 'Thursday'
    if weekDayInt == 5:
        return 'Friday'
    if weekDayInt == 6:
        return 'Saturday'
        
    return 'error, weekday not found'
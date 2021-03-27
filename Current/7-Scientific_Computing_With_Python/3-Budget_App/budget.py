class Category:
  def __init__(self, name) -> None:
      self.name = name
      self.ledger = []
      self.funds = 0

  def __str__(self) -> str:
    result = self.name.center(30, '*') + '\n'
    for x in self.ledger:
      description = x["description"][0:23]
      width = 30 - len(description)
      formatted_amount = f'{x["amount"]:.2f}'.rjust(width)
      result = f'{result}{description}{formatted_amount}\n'
    return result

  def deposit(self, amount, description=''):
    self.ledger.append({
      'amount': amount,
      'description': description
    })

    self.funds = self.funds + amount

  def withdraw(self, amount, description=''):
    if self.check_funds(amount) == False:
      return False
      
    self.ledger.append({
        'amount': -abs(amount),
        'description': description
      })
    self.funds = self.funds - amount
    return True

  def get_balance(self):
    return self.funds

  def transfer(self, amount, category):
    if self.check_funds(amount) == False:
      return False

    self.withdraw(amount, f'Transfer to {category.name}')
    category.deposit(amount, f'Transfer from {self.name}')
    return True

  def check_funds(self, amount):
    if amount > self.funds:
      return False
    else:
      return True

def create_spend_chart(categories):
  chart = 'Percentage spent by category\n'
  totals = []
  for cat in categories:
    total = 0
    for item in cat.ledger:
      if item['amount'] < 0:
        total = total + abs(item['amount'])
    total = round(total, 2)
    totals.append(
      {
        'category':cat.name,
        'total':total
      }
    )

  all_spent = []
  for x in totals:
    all_spent.append(x['total'])

  all_spent = sum(all_spent)

  for x in totals:
    percentage_spent = x['total'] / all_spent
    int_percent = int(f'{percentage_spent:.2f}'[2:])
    int_percent = round(int_percent, -1)
    x['percent_spent'] = int_percent

  # draw y axis and bars
  y_axis = 100
  while y_axis >= 0:
    y_axis_padding = str(y_axis).rjust(3)
    chart = f'{chart}{y_axis_padding}| '
    for x in totals:
      if x['percent_spent'] >= y_axis:
        chart = f'{chart}o  '
      else:
        chart = f'{chart}   '
    chart = f'{chart}\n'
    y_axis = y_axis - 10

  # draw x axis
  cat_length = len(categories)
  x_axis = '    ' + ''.rjust(cat_length * 3, '-') + '-'
  chart = f'{chart}{x_axis}\n'

  # draw category names
  letter_index = 0
  max_cat_name_length = 0
  for x in totals:
    if len(x['category']) > max_cat_name_length:
      max_cat_name_length = len(x['category'])

  while letter_index < max_cat_name_length:
    chart = f'{chart}     '
    for x in totals:
      if len(x['category']) >= letter_index + 1:
        letter = x['category'][letter_index]
      else:
        letter = ' '
      chart = f'{chart}{letter}  '
    chart = f'{chart}\n'
    letter_index = letter_index + 1

  return chart
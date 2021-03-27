class Category:
  ledger = []
  funds = 0

  def __init__(self, name) -> None:
      self.name = name

  def __str__(self) -> str:
    result = self.name.center(30, '*') + '\n'
    print(self.ledger)
    return result

  def deposit(self, amount, description=''):
    self.ledger.append({
      'amount': amount,
      'description': description
    })

    self.funds = self.funds + amount


  def withdraw(self, amount, description=''):
    if self.check_funds == False:
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
    if self.check_funds == False:
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
  return 'create spend chart done'
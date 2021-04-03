import random
# Consider using the modules imported above.

class Hat:
  def __init__(self, **kwargs):
    self.contents = []
    for k,v in kwargs.items():
      for x in range(v):
        self.contents.append(k)

  def draw(self, num):
    if num >= len(self.contents):
      temp = self.contents.copy()
      self.contents = []
      return temp

    the_draw = []
    for x in range(num):
      index = random.randint(0, len(self.contents) - 1)
      the_draw.append(self.contents.pop(index))
    
    return the_draw

def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
  original_balls = hat.contents.copy()
  correct_balls = {}
  successful_attempts = 0

  for color in expected_balls:
    correct_balls[color] = 0

  for x_experiment in range(num_experiments):
    hat.contents = original_balls.copy()
    draw = hat.draw(num_balls_drawn)

    for color in correct_balls:
      correct_balls[color] = draw.count(color)

    valid = True
    for color in correct_balls:
      if correct_balls[color] >= expected_balls[color]:
        continue
      else:
        valid = False
        break
    
    if valid == True:
      successful_attempts = successful_attempts + 1

  return successful_attempts / num_experiments
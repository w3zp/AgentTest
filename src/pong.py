import os
import time

WIDTH = 40
HEIGHT = 10

BALL_CHAR = 'O'
PADDLE_CHAR = '|'
BLANK_CHAR = ' '

# paddles vertical positions (top)
left_paddle_y = HEIGHT // 2 - 1
right_paddle_y = HEIGHT // 2 - 1

ball_x = WIDTH // 2
ball_y = HEIGHT // 2
ball_vx = 1
ball_vy = 1

score_left = 0
score_right = 0


def draw_board():
    os.system('clear')
    # top border
    print('+' + '-' * WIDTH + '+')
    for y in range(HEIGHT):
        row = [' '] * WIDTH
        # paddles
        if left_paddle_y <= y < left_paddle_y + 3:
            row[1] = PADDLE_CHAR
        if right_paddle_y <= y < right_paddle_y + 3:
            row[WIDTH - 2] = PADDLE_CHAR
        # ball
        if y == ball_y:
            row[ball_x] = BALL_CHAR
        print('|' + ''.join(row) + '|')
    print('+' + '-' * WIDTH + '+')
    print(f"Score Left: {score_left}  Right: {score_right}")


for _ in range(60):
    draw_board()
    time.sleep(0.1)
    
    
    # move ball
    ball_x += ball_vx
    ball_y += ball_vy

    # bounce off top/bottom
    if ball_y <= 0 or ball_y >= HEIGHT - 1:
        ball_vy *= -1

    # collision with left paddle
    if ball_x == 2 and left_paddle_y <= ball_y < left_paddle_y + 3:
        ball_vx *= -1
    # collision with right paddle
    if ball_x == WIDTH - 3 and right_paddle_y <= ball_y < right_paddle_y + 3:
        ball_vx *= -1

    # scoring
    if ball_x <= 0:
        score_right += 1
        ball_x, ball_y = WIDTH // 2, HEIGHT // 2
    if ball_x >= WIDTH - 1:
        score_left += 1
        ball_x, ball_y = WIDTH // 2, HEIGHT // 2

    # simple AI to track ball
    if ball_y < left_paddle_y:
        left_paddle_y -= 1
    elif ball_y > left_paddle_y + 2:
        left_paddle_y += 1

    if ball_y < right_paddle_y:
        right_paddle_y -= 1
    elif ball_y > right_paddle_y + 2:
        right_paddle_y += 1

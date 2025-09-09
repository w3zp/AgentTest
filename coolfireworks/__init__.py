import random
import shutil
import sys
import time

_COLORS = [31, 32, 33, 34, 35, 36]


def frame(width, height, density=0.05, colored=True):
    """Return a list of strings forming one frame of fireworks.

    Each position is filled with a colored asterisk with probability
    ``density`` or a space otherwise.
    """
    lines = []
    for _ in range(height):
        line = []
        for _ in range(width):
            if random.random() < density:
                if colored:
                    color = random.choice(_COLORS)
                    line.append(f"\x1b[{color}m*\x1b[0m")
                else:
                    line.append("*")
            else:
                line.append(" ")
        lines.append("".join(line))
    return lines


def show(duration=5, density=0.05):
    """Animate fireworks in the terminal for ``duration`` seconds."""
    width, height = shutil.get_terminal_size((80, 24))
    end = time.time() + duration
    sys.stdout.write("\x1b[?25l")  # hide cursor
    try:
        while time.time() < end:
            lines = frame(width, height, density)
            sys.stdout.write("\x1b[H")
            sys.stdout.write("\n".join(lines))
            sys.stdout.flush()
            time.sleep(0.1)
    finally:
        sys.stdout.write("\x1b[?25h\x1b[0m\n")
        sys.stdout.flush()

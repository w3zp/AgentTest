"""Generate colorful ASCII fireworks."""
from __future__ import annotations
import random

COLORS = [
    "\033[91m",  # red
    "\033[92m",  # green
    "\033[93m",  # yellow
    "\033[94m",  # blue
    "\033[95m",  # magenta
    "\033[96m",  # cyan
]
RESET = "\033[0m"


def generate_fireworks(width: int = 40, height: int = 15, density: float = 0.1) -> str:
    """Return a string containing colorful ASCII fireworks.

    Args:
        width: width of each line
        height: number of lines
        density: probability of a star at each position (0 to 1)
    """
    lines = []
    for _ in range(height):
        line_chars = []
        for _ in range(width):
            if random.random() < density:
                line_chars.append(random.choice(COLORS) + '*' + RESET)
            else:
                line_chars.append(' ')
        lines.append(''.join(line_chars))
    return '\n'.join(lines)

import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from coolfireworks import frame


def test_frame_dimensions():
    w, h = 8, 4
    lines = frame(w, h, density=1, colored=False)
    assert len(lines) == h
    assert all(len(line) == w for line in lines)
    assert all(set(line) == {"*"} for line in lines)


def test_frame_empty():
    w, h = 5, 3
    lines = frame(w, h, density=0, colored=False)
    assert len(lines) == h
    assert all(line == " " * w for line in lines)

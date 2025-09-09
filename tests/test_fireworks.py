from coolfireworks.fireworks import generate_fireworks


def test_generate_fireworks_dimensions():
    art = generate_fireworks(width=10, height=5, density=0)
    lines = art.splitlines()
    assert len(lines) == 5
    assert all(len(line) == 10 for line in lines)


def test_generate_fireworks_has_stars():
    art = generate_fireworks(width=10, height=5, density=1.0)
    assert '*' in art

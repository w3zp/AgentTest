from . import show
import argparse


def main():
    parser = argparse.ArgumentParser(description="Display ASCII fireworks")
    parser.add_argument("--duration", type=float, default=5, help="seconds to run")
    parser.add_argument("--density", type=float, default=0.05, help="star density")
    args = parser.parse_args()
    try:
        show(duration=args.duration, density=args.density)
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()

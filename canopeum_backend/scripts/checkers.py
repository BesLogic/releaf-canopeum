#!/usr/bin/env python3

from pathlib import Path
from subprocess import run  # noqa: S404 -- Do not pass user input as arguments

path = (Path(__file__).parent.parent / "canopeum_backend").absolute()


def main():
    print("\nRunning Ruff...")
    run(("ruff", "format", path), check=False)
    run(("ruff", "check", "--fix", path), check=False)
    print("\nRunning mypy...")
    run(("mypy", path), check=False)
    print("\nRunning pyright...")
    run(("pyright", path), check=False)


if __name__ == "__main__":
    main()

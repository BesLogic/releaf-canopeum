#!/usr/bin/env python3

from collections.abc import Sequence
from pathlib import Path
from subprocess import run  # noqa: S404 # Do not pass user input as arguments
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from _typeshed import StrOrBytesPath

path = (Path(__file__).parent.parent).absolute()


def run_command(command: Sequence["StrOrBytesPath"]):
    print(f"\nRunning: {" ".join(str(arg) for arg in command)}")
    run(command, check=False)


def main():
    run_command(("ruff", "check", path, "--fix"))
    run_command(("ruff", "format", path))
    run_command(("mypy", path, "--config-file", path / "pyproject.toml"))
    run_command(("pyright", path))


if __name__ == "__main__":
    main()

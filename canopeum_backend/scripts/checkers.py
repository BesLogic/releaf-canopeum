#!/usr/bin/env python3

import os
from collections.abc import Sequence
from pathlib import Path
from subprocess import run  # noqa: S404 # Do not pass user input as arguments
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from _typeshed import StrOrBytesPath

backend_root = (Path(__file__).parent.parent).absolute()
os.chdir(backend_root)


def run_command(command: Sequence["StrOrBytesPath"]):
    print(f"\nRunning: {" ".join(str(arg) for arg in command)}")
    run(command, check=False)


def main():
    run_command(("ruff", "check", "--fix"))
    run_command(("ruff", "format"))
    run_command(("mypy", backend_root))
    run_command(("pyright",))


if __name__ == "__main__":
    main()

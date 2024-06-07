(function () {
  class controls {
    getInfo() {
      return {
        id: "controls",
        name: "Controls",
        color1: "#ffab19",
        color2: "#ec9c13",
        color3: "#cf8b17",
        showColor: true,
        menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3Ny4xMzgxMyIgaGVpZ2h0PSI3Ny4xMzgxMyIgdmlld0JveD0iMCwwLDc3LjEzODEzLDc3LjEzODEzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAxLjQzMDk3LC0xNDEuNDMwOTcpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTI1OC45NDAxMSwyMDIuODU3MzhjMCwwIC01Ljg1NDQzLDAgLTcuOTIwMjMsMGMtMS4zMjc2NCwwIC0zLjI3MTMzLC0xLjQ3MTk3IC0zLjI3MTMzLC0zLjA5OTMxYzAsLTQuNjk4NjQgMCwtMjguOTUwNjkgMCwtMzguOTk5NTJjMCwtMi44NTY2MiAxLjc2MzA2LC0zLjYxNTg0IDMuMDEzMDUsLTMuNjE1ODRjMi4wNTk0LDAgOC4xNzg1MSwwIDguMTc4NTEsMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI4LjUiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIzMi4wNjkxNywxNzIuMTA2NmwxMy4wMTAzOCw3LjUwNTk5IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iOC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjAxLjQzMDk4LDIxOC41NjkxMXYtNzcuMTM4MTNoNzcuMTM4MTN2NzcuMTM4MTN6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjIzLjc3MTg2LDE3NC43NDgyNGMtMy45NDYzMSwwIC03LjE0NTQzLC0zLjE5OTEyIC03LjE0NTQzLC03LjE0NTQzYzAsLTMuOTQ2MzEgMy4xOTkxMiwtNy4xNDU0MyA3LjE0NTQzLC03LjE0NTQzYzMuOTQ2MzEsMCA3LjE0NTQzLDMuMTk5MTIgNy4xNDU0Myw3LjE0NTQzYzAsMy45NDYzMSAtMy4xOTkxMiw3LjE0NTQzIC03LjE0NTQzLDcuMTQ1NDN6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjI3LjA5MzA3LDE5MS4yNjQ3NmwxOC44NTQwOCwtMTAuODc3MzUiIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2luZGV4JnF1b3Q7Om51bGx9IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iOC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjI5LjE1OTI3LDE5Mi4zOTcxOWMwLDIuNDk2MjIgLTIuMDIzNTksNC41MTk4MSAtNC41MTk4MSw0LjUxOTgxYy0yLjQ5NjIyLDAgLTQuNTE5ODEsLTIuMDIzNTkgLTQuNTE5ODEsLTQuNTE5ODFjMCwtMi40OTYyMiAyLjAyMzU5LC00LjUxOTgxIDQuNTE5ODEsLTQuNTE5ODFjMi40OTYyMiwwIDQuNTE5ODEsMi4wMjM1OSA0LjUxOTgxLDQuNTE5ODF6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjguNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjozOC41NjkwMjUwMDAwMDAwMTozOC41NjkwMjUwMDAwMDAwMS0tPg==",
        blocks: [
          {
            opcode: "ifStatement",
            type: sugarcube.BlockType.CONDITIONAL,
            text: "if [condition] then [dummy] [statement]",
            arguments: {
              condition: {
                type: sugarcube.ArgumentType.BOOLEAN,
              },
              dummy: {
                type: sugarcube.ArgumentType.DUMMY,
              },
              statement: {
                type: sugarcube.ArgumentType.STATEMENT,
              },
            },
          },
          {
            opcode: "ifElse_Statement",
            type: sugarcube.BlockType.CONDITIONAL,
            text: "if [condition] then [dummy] [statement] else [dummy2] [statement2]",
            arguments: {
              condition: {
                type: sugarcube.ArgumentType.BOOLEAN,
              },
              dummy: {
                type: sugarcube.ArgumentType.DUMMY,
              },
              statement: {
                type: sugarcube.ArgumentType.STATEMENT,
              },
              dummy2: {
                type: sugarcube.ArgumentType.DUMMY,
              },
              statement2: {
                type: sugarcube.ArgumentType.STATEMENT,
              },
            },
          },
          "---",
          {
            opcode: "inline",
            type: sugarcube.BlockType.INLINE,
            text: "inline [dummy] [condition]",
            arguments: {
              dummy: {
                type: sugarcube.ArgumentType.DUMMY,
              },
              condition: {
                type: sugarcube.ArgumentType.STATEMENT,
              },
            },
          },
          {
            opcode: "return",
            type: sugarcube.BlockType.COMMAND,
            text: "return [value]",
            isTerminal: true,
            arguments: {
              value: {
                type: sugarcube.ArgumentType.STRING,
              },
            },
          },
        ],
      };
    }

    ifStatement(args) {
      console.log(args);
    }

    ifElse_Statement(args) {
      if (Boolean(args.condition) == true) {
        args.statement();
      } else {
        args.statement2();
      }
    }

    inline(args) {}
  }

  sugarcube.extensionManager.registerExtension(new controls());
})();
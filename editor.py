import Tkinter as Tk

class tool (Tk.Button):
    def __init__ (self, master, img = '', caption = ''):
        Tk.Button.__init__(self, master, text = caption)

root = Tk.Tk()

frame = Tk.Frame(root)

canvas = Tk.Canvas(frame, height = 500, width = 500)
canvas.pack()

canvas.create_rectangle(100, 100, 400, 200)

frame.grid(row = 2, column = 1, rowspan = 10, columnspan = 10)

with open('./records.csv') as f:
    p, u = f.readline().split(',')
    s = p + ' - ' + u
    Tk.Label(root, text = s).grid(row = 0, column = 0, columnspan = 10)

xmenu = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
ymenu = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

xbtn = {}
ybtn = {}

for a, b in enumerate(xmenu):
    xbtn[b] = tool(root, caption = b)
    xbtn[b].grid(row = 1, column = a+1)

for a, b in enumerate(ymenu):
    ybtn[b] = tool(root, caption = b)
    ybtn[b].grid(row = a+2, column = 0)

root.mainloop()
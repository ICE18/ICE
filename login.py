from Tkinter import *
from os import path

# Related functions
def new ():
    project = entry.get()
    with open('./records.csv', 'w') as f:
        f.write(project)

# Login window
root = Tk()
root.title(string = 'ICE')

Label(root, text = 'Project', font = 'Consolas 24', relief = FLAT).grid(row = 0, column = 0, sticky = 'nwe')

entry = Entry(root, width = 25, font = 'Garamond 12', justify = CENTER)
entry.grid(row = 1, column = 0, ipady=5)
if path.exists('./records.csv'):
    with open('./records.csv') as f:
        project = f.readline().split(',')[0]
        entry.insert(0, project)

btn1 = Button(root, text = 'New Project', font = 'Monospace 16', relief = RIDGE, command = new)
btn2 = Button(root, text = 'Join Project', font = 'Monospace 16', relief = RIDGE)

btn1.grid(row = 2, column = 0, sticky = 'ew')
btn2.grid(row = 3, column = 0, sticky = 'ew')

root.mainloop()

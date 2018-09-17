try:
    import Tkinter as tk
except ImportError:
    import tkinter as tk
from os import path

# Related functions
def new ():
    project.get()
    with open('./records.csv', 'w') as f:
        f.write(project)

def connect ():
    #project = project.get()
    project_e.config(state = tk.DISABLED, disabledbackground = '#fff', disabledforeground = '#f2d')
    """
    add code here
    """
    btn1.grid_remove()
    btn2.grid_remove()
    display_user()

def display_user ():
    login_user.tkraise()


root = tk.Tk()
root.title(string = 'ICE')
root.config(bg = '#5768BA')
project = tk.StringVar()
user = tk.StringVar()

if path.exists('./records.csv'):
    with open('./records.csv') as f:
        config = f.readline().split(',')
        try:
            project.set(config[0])
            user.set(config[1])
        except IndexError:
            user.set('')

# User window
login_user = tk.Frame(root, bg = '#5768BA')
login_user.grid(row = 0, column = 0, sticky = 'news')

tk.Label(login_user, text = 'Project', font = 'Consolas 24', relief = tk.FLAT).grid(row = 0, column = 0, sticky = 'nw')
tk.Label(login_user, textvariable = project, font = 'Consolas 24', relief = tk.FLAT, justify = tk.CENTER).grid(row = 0, column = 1, sticky = 'nw')

tk.Label(login_user, text = 'User', font = 'Consolas 24', relief = tk.FLAT).grid(row = 1, column = 0, sticky = 'nw')

user_e = tk.Entry(login_user, textvariable = user, width = 25, font = 'Garamond 12', justify = tk.CENTER)
user_e.grid(row = 1, column = 1, ipady=5)

btn1 = tk.Button(login_user, text = 'New User', font = 'Monospace 16', relief = tk.RIDGE, bg = '#F8F8F8', fg = '#353175', highlightbackground = '#5768BA', borderwidth = 2 ,command = new)
btn2 = tk.Button(login_user, text = 'Old User', font = 'Monospace 16', relief = tk.RIDGE, bg = '#F8F8F8', fg = '#353175', highlightbackground = '#5768BA', borderwidth = 2 ,command = connect)

btn1.grid(row = 3, column = 0, columnspan = 2, sticky = 'ew')
btn2.grid(row = 4, column = 0, columnspan = 2, sticky = 'ew')

# Project window
login_proj = tk.Frame(root, bg = '#5768BA')
login_proj.grid(row = 0, column = 0, sticky = 'news')

tk.Label(login_proj, text = 'Project', font = 'Consolas 24', relief = tk.FLAT).grid(row = 0, column = 0, sticky = 'nw')

project_e = tk.Entry(login_proj, textvariable = project, width = 25, font = 'Garamond 12', justify = tk.CENTER)
project_e.grid(row = 0, column = 1, ipady=5)

btn1 = tk.Button(login_proj, text = 'New Project', font = 'Monospace 16', relief = tk.RIDGE, bg = '#F8F8F8', fg = '#353175', highlightbackground = '#5768BA', borderwidth = 2, command = new)
btn2 = tk.Button(login_proj, text = 'Join Project', font = 'Monospace 16', relief = tk.RIDGE, bg = '#F8F8F8', fg = '#353175', highlightbackground = '#5768BA', borderwidth = 2, command = connect)

btn2.grid(row = 3, column = 0, columnspan = 2, sticky = 'ew')
btn1.grid(row = 2, column = 0, columnspan = 2, sticky = 'ew')

root.mainloop()

try:
    import Tkinter as tk
except ImportError:
    import tkinter as tk
from os import path

# Related functions
def lock ():
	project_e.config(state = tk.DISABLED, disabledbackground = '#F8F8F8', disabledforeground = '#353175', relief = tk.SUNKEN)
	user_e.config(state = tk.DISABLED, disabledbackground = '#F8F8F8', disabledforeground = '#353175', relief = tk.SUNKEN)

def new ():
	lock()
	p, u = project.get(), user.get()
	with open('./records.csv', 'a') as f:
		f.write(p + ',' + u + '\n')

def connect ():
	lock()
    # use project.get() and user.get() to get the project and user name
    """
    add code here
    """

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

tk.Label(root, text = 'Project:', font = 'Consolas 24', width = 10, relief = tk.FLAT, bg = '#F8F8F8', fg = '#5768BA').grid(row = 0, column = 0, sticky = 'new')
project_e = tk.Entry(root, textvariable = project, width = 25, font = 'Garamond 20', justify = tk.CENTER, bg = '#5768BA', fg = '#F8F8F8')
project_e.grid(row = 0, column = 1, ipady=5)

tk.Label(root, text = 'User:', font = 'Consolas 24', width = 10, relief = tk.FLAT, bg = '#F8F8F8', fg = '#5768BA').grid(row = 1, column = 0, sticky = 'new')
user_e = tk.Entry(root, textvariable = user, width = 25, font = 'Garamond 20', justify = tk.CENTER, bg = '#5768BA', fg = '#F8F8F8')
user_e.grid(row = 1, column = 1, ipady=5)

btn1 = tk.Button(root, text = 'Create', font = 'Monospace 16', relief = tk.RIDGE, bg = '#F8F8F8', fg = '#353175', highlightbackground = '#5768BA', borderwidth = 2 ,command = new)
btn2 = tk.Button(root, text = 'Connect', font = 'Monospace 16', relief = tk.RIDGE, bg = '#F8F8F8', fg = '#353175', highlightbackground = '#5768BA', borderwidth = 2 ,command = connect)

btn1.grid(row = 3, column = 0, columnspan = 2, sticky = 'ew')
btn2.grid(row = 4, column = 0, columnspan = 2, sticky = 'ew')

root.mainloop()

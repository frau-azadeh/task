import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assignedTo: string;
  progress: number;
  startDate: string;
  endDate: string;
}

const filePath = path.join(process.cwd(), 'data', 'tasks.json');
const JWT_SECRET = 'your_secret_key'; 

const emailToUserMap: { [key: string]: string } = {
  'ahmad@example.com': 'ahmad',
  'maryam@example.com': 'maryam',
  'shahin@example.com': 'shahin',
};

async function readTasks(): Promise<Task[]> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data) as Task[];
  } catch (error) {
    console.error('Error reading tasks:', error);
    throw new Error('Failed to read tasks');
  }
}

async function writeTasks(tasks: Task[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing tasks:', error);
    throw new Error('Failed to write tasks');
  }
}

function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return typeof decoded === 'string' ? null : (decoded as JwtPayload);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
//GET
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const tasks = await readTasks();
    const user = emailToUserMap[decoded.email];
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userTasks = decoded.role === 'admin'
      ? tasks
      : tasks.filter(task => task.assignedTo.toLowerCase() === user.toLowerCase());

    return NextResponse.json({ tasks: userTasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
//POST
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, status, progress, startDate, endDate } = body;

    if (!title || !description || !status || progress == null || progress < 0 || progress > 100 || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const tasks = await readTasks();

    const userName = emailToUserMap[decoded.email];
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      status,
      assignedTo: userName,
      progress,
      startDate,
      endDate,
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error adding task:', error);
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}
//put
export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const tasks = await readTasks();
    const body = await req.json();
    const { id, title, description, status, assignedTo, progress, startDate, endDate } = body;

    if (!title || !description || !status || progress == null || progress < 0 || progress > 100 || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (decoded.role !== 'admin' && assignedTo && tasks[taskIndex].assignedTo !== assignedTo) {
      return NextResponse.json({ error: 'Forbidden: Only admin can change assigned user' }, { status: 403 });
    }

    tasks[taskIndex] = {
      id,
      title,
      description,
      status,
      assignedTo: decoded.role === 'admin' ? assignedTo : tasks[taskIndex].assignedTo,
      progress,
      startDate,
      endDate
    };
    await writeTasks(tasks);

    return NextResponse.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
//DELETE
export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const tasks = await readTasks();
    const { id } = await req.json();

    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (decoded.role !== 'admin' && tasks[taskIndex].assignedTo.toLowerCase() !== emailToUserMap[decoded.email]) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    tasks.splice(taskIndex, 1);
    await writeTasks(tasks);

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
'use client';

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { Task, User } from '@/types';
import { cn, formatRelativeTime } from '@/utils';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate: (columnId: string) => void;
  users: User[];
}

interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
  color: string;
}

const columns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', status: 'todo', color: 'bg-gray-100 dark:bg-gray-700' },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'review', title: 'Review', status: 'review', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'done', title: 'Done', status: 'done', color: 'bg-green-100 dark:bg-green-900' },
];

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

interface TaskCardProps {
  task: Task;
  users: User[];
  isDragOverlay?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, users, isDragOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const assignee = users.find(user => user.id === task.assignee?.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50',
        isDragOverlay && 'rotate-5 scale-105'
      )}
    >
      <Card className={cn(
        'mb-3 hover:shadow-md transition-shadow',
        isDragOverlay && 'shadow-lg'
      )}>
        <Card.Content className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white pr-2">
              {task.title}
            </h4>
            <div className={cn(
              'w-2 h-2 rounded-full flex-shrink-0',
              priorityColors[task.priority]
            )} />
          </div>
          
          {task.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {assignee && (
                <Avatar
                  src={assignee.avatar}
                  name={assignee.name}
                  size="xs"
                />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeTime(task.updatedAt)}
              </span>
            </div>
            
            {task.dueDate && (
              <span className={cn(
                'text-xs px-2 py-1 rounded',
                new Date(task.dueDate) < new Date()
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              )}>
                Due {formatRelativeTime(task.dueDate)}
              </span>
            )}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

interface KanbanColumnProps {
  column: KanbanColumn;
  tasks: Task[];
  users: User[];
  onTaskCreate: (columnId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  tasks, 
  users, 
  onTaskCreate 
}) => {
  const columnTasks = tasks.filter(task => task.status === column.status);

  return (
    <div className="flex flex-col h-full min-w-80">
      <div className={cn(
        'flex items-center justify-between p-3 rounded-t-lg',
        column.color
      )}>
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {column.title}
          </h3>
          <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
            {columnTasks.length}
          </span>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onTaskCreate(column.id)}
          className="h-6 w-6 p-0"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Button>
      </div>
      
      <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
        <SortableContext items={columnTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {columnTasks.map(task => (
              <TaskCard key={task.id} task={task} users={users} />
            ))}
          </div>
        </SortableContext>
        
        {columnTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 01-2 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-sm">No tasks yet</p>
            <p className="text-xs">Click + to add a task</p>
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskUpdate,
  onTaskCreate,
  users,
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  }, [tasks]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) return;

    // Find the target column based on the drop target
    let targetStatus: Task['status'] | null = null;
    
    // Check if dropped on a column header or in a column
    const overColumn = columns.find(col => col.id === over.id);
    if (overColumn) {
      targetStatus = overColumn.status;
    } else {
      // Dropped on another task, find its column
      const overTask = tasks.find(task => task.id === over.id);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (targetStatus && activeTask.status !== targetStatus) {
      onTaskUpdate(activeTask.id, { status: targetStatus });
    }
  }, [tasks, onTaskUpdate]);

  const handleDragOver = useCallback(() => {
    // Handle drag over for better UX if needed
  }, []);

  return (
    <div className="h-full overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-4 h-full min-w-max p-4">
          {columns.map(column => (
            <SortableContext
              key={column.id}
              items={[column.id]}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                column={column}
                tasks={tasks}
                users={users}
                onTaskCreate={onTaskCreate}
              />
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} users={users} isDragOverlay />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;

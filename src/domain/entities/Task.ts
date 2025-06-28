import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import type { User } from './User';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 120 })
  title: string;

  @Column('varchar', { nullable: true })
  description?: string | null;

  @Column('boolean', { nullable: true })
  status?: boolean | null;

  @Column('date', { nullable: true })
  dueDate?: Date | null;

  @Column('varchar', { nullable: true })
  priority?: string | null;

  @ManyToOne('User', {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'assignee_user_id' })
  assigneeUser: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

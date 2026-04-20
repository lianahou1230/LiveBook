import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "journals" })
export class JournalEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "integer", nullable: true })
  showId?: number;

  @Column({ type: "text", nullable: true })
  content?: string;

  @Column({ type: "date" })
  journalDate!: string;

  @Column({ type: "text", nullable: true })
  mood?: string;

  @Column({ type: "text", nullable: true })
  weather?: string;

  @Column({ type: "text", nullable: true })
  coverImage?: string;

  @Column({ type: "simple-json", nullable: true })
  photos?: string[];

  @Column({ type: "text", nullable: true })
  category?: string;

  @Column({ type: "text", nullable: true })
  paperStyle?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

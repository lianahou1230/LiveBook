import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity({ name: "photos" })
export class PhotoEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "integer", nullable: true })
  showId?: number;

  @Column({ type: "integer", nullable: true })
  journalId?: number;

  @Column({ type: "text" })
  url!: string;

  @Column({ type: "text", nullable: true })
  caption?: string;

  @Column({ type: "text", nullable: true })
  tag?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "shows" })
export class ShowEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text", nullable: true })
  artist?: string;

  @Column({ type: "text", nullable: true })
  venue?: string;

  @Column({ type: "text", nullable: true })
  city?: string;

  @Column({ type: "date" })
  showDate!: string;

  @Column({ type: "text", nullable: true })
  showTime?: string;

  @Column({ type: "text", nullable: true })
  genre?: string;

  @Column({ type: "text", nullable: true })
  posterUrl?: string;

  @Column({ type: "integer", nullable: true })
  rating?: number;

  @Column({ type: "text", nullable: true })
  ticketPrice?: string;

  @Column({ type: "text", nullable: true })
  seatInfo?: string;

  @Column({ type: "boolean", default: false })
  isUpcoming!: boolean;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

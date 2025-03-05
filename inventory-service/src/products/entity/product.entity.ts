import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Products {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column('decimal', {precision: 10, scale: 2})
    price : number;

    @Column()
    quantity : number;
}
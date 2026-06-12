import { Column, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('stocks')
@Unique(['produitId', 'magasinId'])
export class Stock
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    produitId: string;

    @Column()
    magasinId: string;

    @Column({ type: 'int', default: 0 })
    quantite: number;

    @UpdateDateColumn()
    misAJourLe: Date;
}
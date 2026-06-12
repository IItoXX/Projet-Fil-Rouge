import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleUtilisateur } from './role.enum';

@Entity('utilisateurs')
export class Utilisateur
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    motDePasse: string;

    @Column()
    nom: string;

    @Column({ type: 'enum', enum: RoleUtilisateur, default: RoleUtilisateur.CLIENT })
    role: RoleUtilisateur;

    @CreateDateColumn()
    creeLe: Date;
}
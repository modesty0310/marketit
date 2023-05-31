import {
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
  } from 'typeorm'
  import { Exclude } from 'class-transformer'
  
  export abstract class CommonEntity {
    @CreateDateColumn()
    createdAt: Date
  
    @UpdateDateColumn()
    updatedAt: Date
  
    // Soft Delete : 기존에는 null, 삭제시에 timestamp를 찍는다.
    @Exclude()
    @DeleteDateColumn()
    deletedAt?: Date | null
  }
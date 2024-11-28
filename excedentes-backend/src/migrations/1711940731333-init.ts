import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1711940731333 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`INSERT INTO
    clientes (cpf_cnpj, tipo_cliente, nome, email, password)
VALUES
    (
        '66332361077',
        'Pessoa Fisica',
        'Tanya Morgan',
        'sierra25@yahoo.com',
        '%Q6Y5pcTJ)'
    ),
    (
        '76996616050',
        'Pessoa Fisica',
        'Brittany Jones',
        'erin66@yahoo.com',
        'NA8Jb5sz9!'
    ),
    (
        '66715433054',
        'Pessoa Fisica',
        'William Bennett',
        'ccarpenter@hotmail.com',
        ')2vF8CsNL_'
    ),
    (
        '78479734051',
        'Pessoa Fisica',
        'Michael Davis',
        'dennis64@mckay.com',
        '&7QCoxRfwJ'
    ),
    (
        '14178410016',
        'Pessoa Fisica',
        'Catherine Cole',
        'rachel59@yahoo.com',
        '4x0QLhx!J)'
    ),
    (
        '76539899009',
        'Pessoa Fisica',
        'Lucas Mason',
        'qrichardson@gmail.com',
        'y9rpEvDp_!'
    ),
    (
        '25440470034',
        'Pessoa Fisica',
        'Karen Clark',
        'hudsonmiguel@hotmail.com',
        'O_N5FP@gf+'
    ),
    (
        '47918674081',
        'Pessoa Fisica',
        'Edwin Jones',
        'grosssherri@ellis.com',
        '7xSWYBja(#'
    ),
    (
        '15571941065',
        'Pessoa Fisica',
        'Kimberly Rice',
        'sean36@gmail.com',
        '(2Bh#&5i%L'
    ),
    (
        '38395863055',
        'Pessoa Fisica',
        'Renee Chapman',
        'victoriacarey@russo.com',
        'YH1IPc876&'
    ),
    (
        '67712659000141',
        'Pessoa Juridica',
        'Bradley Faulkner',
        'fcohen@yahoo.com',
        '^6u7Imt!6)'
    ),
    (
        '82526339000190',
        'Pessoa Juridica',
        'Deanna Thomas',
        'turnersteven@davenport.com',
        '#P@Z5pFlrV'
    ),
    (
        '52171104000162',
        'Pessoa Juridica',
        'Matthew Martin',
        'gonzalezkelly@gonzales.com',
        '%gq)TFrh_1'
    ),
    (
        '87604272000189',
        'Pessoa Juridica',
        'Lauren Turner',
        'melaniedixon@gmail.com',
        '@HMVgHy!A5'
    ),
    (
        '93753986000151',
        'Pessoa Juridica',
        'Jason Payne',
        'vhendricks@yahoo.com',
        'aRR9^Buq$X'
    ),
    (
        '48187547000174',
        'Pessoa Juridica',
        'Jessica Espinoza',
        'austinjason@hotmail.com',
        'pK&9Fm1v_&'
    ),
    (
        '45586813000143',
        'Pessoa Juridica',
        'Edwin Kirk',
        'daniel11@ray-cervantes.com',
        '&pF1O3)r70'
    ),
    (
        '81713784000105',
        'Pessoa Juridica',
        'Christopher White',
        'lkennedy@gmail.com',
        'D1rD7@ek+2'
    ),
    (
        '41839502000198',
        'Pessoa Juridica',
        'Daniel Lopez',
        'richardmartinez@yahoo.com',
        'F*%36XCj+w'
    ),
    (
        '45546704000100',
        'Pessoa Juridica',
        'James Moore',
        'fterry@hotmail.com',
        '$z1YNqC0*g'
    );`);
  }

  public async down(): Promise<void> {}
}

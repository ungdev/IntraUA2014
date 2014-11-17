Sequel.migration do
  up do
    alter_table(:users) do
       add_column :salt, String
       add_column :password, String
    end
  end

  down do
    alter_table(:users) do
       drop_column :salt
       drop_column :password
    end
  end
end
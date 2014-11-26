Sequel.migration do
  up do
    alter_table(:tournaments) do
       add_column :data, String, :text=>true
    end
  end

  down do
    alter_table(:tournaments) do
       drop_column :data
    end
  end
end
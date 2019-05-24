# (C) 2019 Crafted by Roberto Nogueira
# email : roberto.nogueira@tecnogrupo.com.br.com
# trello: robertonogueira17

Pry.config.pager = true
Pry.config.color = true
Pry.config.history.should_save = true

# wrap ANSI codes so Readline knows where the prompt ends
def colour(name, text)
  if Pry.color
    "\001#{Pry::Helpers::Text.send name, '{text}'}\002".sub '{text}', "\002#{text}\001"
  else
    text
  end
end

Pry.config.prompt = [
    proc do |object, nest_level, pry|
      prompt  = colour :bright_black, Pry.view_clip(object)
      prompt += ":#{nest_level}" if nest_level > 0
      prompt += colour :green, " #{_db}"
      prompt += colour :cyan, " > "
    end, proc { |object, nest_level, pry| colour :cyan, "> " }
]

# tell Readline when the window resizes
old_winch = trap 'WINCH' do
  if `stty size` =~ /\A(\d+) (\d+)\n\z/
    Readline.set_screen_size $1.to_i, $2.to_i
  end
  old_winch.call unless old_winch.nil? || old_winch == 'SYSTEM_DEFAULT'
end

# use awesome print for output if available
begin
  require 'awesome_print'
  Pry.config.print = proc do |output, value|
    value = value.to_a if defined?(ActiveRecord) && value.is_a?(ActiveRecord::Relation)
    output.puts value.ai
  end
rescue LoadError => err
  Pry.config.print = Pry::DEFAULT_PRINT
end

# used to print the content tables when typed, e.g. accesses, status_types..etc
def self.method_missing(m, *args, &block)
  class_name = "#{m}".classify.constantize
  if class_name.is_a?(Class) && ActiveRecord::Base.connection.table_exists?("#{m}")
    case class_name.to_s
    when 'ServiceGrid'
      if args[0].present?
        service_id = args[0]

        grid_ids = ServiceGrid.where(service_id: service_id).pluck(:grid_id)
        puts
        tp Grid.where(id: grid_ids), :id, :name
      else
        puts
        puts "usage: service_grids <service_id>".magenta
        puts
      end
    else
      if (class_name.respond_to? 'name') && (class_name.all.count < 100)
        puts
        tp class_name.all, :id, :name
      else
        puts
        tp class_name.all.limit(20), class_name.column_names[0..8]
      end
    end
  end
end

class String
  def black;          "\e[30m#{self}\e[0m" end
  def red;            "\e[31m#{self}\e[0m" end
  def green;          "\e[32m#{self}\e[0m" end
  def brown;          "\e[33m#{self}\e[0m" end
  def blue;           "\e[34m#{self}\e[0m" end
  def magenta;        "\e[35m#{self}\e[0m" end
  def cyan;           "\e[36m#{self}\e[0m" end
  def gray;           "\e[37m#{self}\e[0m" end

  def bg_black;       "\e[40m#{self}\e[0m" end
  def bg_red;         "\e[41m#{self}\e[0m" end
  def bg_green;       "\e[42m#{self}\e[0m" end
  def bg_brown;       "\e[43m#{self}\e[0m" end
  def bg_blue;        "\e[44m#{self}\e[0m" end
  def bg_magenta;     "\e[45m#{self}\e[0m" end
  def bg_cyan;        "\e[46m#{self}\e[0m" end
  def bg_gray;        "\e[47m#{self}\e[0m" end

  def bold;           "\e[1m#{self}\e[22m" end
  def italic;         "\e[3m#{self}\e[23m" end
  def underline;      "\e[4m#{self}\e[24m" end
  def blink;          "\e[5m#{self}\e[25m" end
  def reverse_color;  "\e[7m#{self}\e[27m" end
end

# handle ActiveRecord database and logs
module Databases
  def _log
    Logger::INFO
  end

  def _log_off
    @old_logger = ActiveRecord::Base.logger
    ActiveRecord::Base.logger = nil
  end

  def _log_on
    ActiveRecord::Base.logger = @old_logger
  end

  def _db
    ActiveRecord::Base.connection.current_database
  end

  def _db_config
    ActiveRecord::Base.connection_config
  end
end

# handy methods for obras
module Obras
  def set_demo
    @user = User.find(1)
    @access = Access.find(17)
    @profile = Profile.find(2)
    @agency = Agency.find(3)
    @projects = Project.default_access(@access, @user, @profile, @agency, opts={status: 1})
  end

  def set_project(project_id=$PROJECT_ID)
    @project = Project.find(project_id)
    $PROJECT_ID = project_id
  end

  def project
    @project
  end

  def project_id
    $PROJECT_ID
  end

  class Project < Project
    def grids
      service_grid_ids = self.service.service_grids.pluck(:grid_id)
      ModuleAdderGrid.joins(:grid).where(grid_id: service_grid_ids).order(:position).pluck(:name)
    end

    def include_grid?(name = 'Identificação da Solicitação')
      self.grids.include? name
    end

    def request_reasons
      service_id = self.service.id
      request_reason_ids = MotiveAndServiceAssociation.where(service_id: service_id).pluck(:request_reason_id)
      RequestReason.where(id: request_reason_ids, active: true).pluck(:name)
    end
  end
end

# initializations
include Databases
include Obras

$PROJECT_ID = nil
_log_on

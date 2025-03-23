
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Search } from "lucide-react";
import { Contact } from "@/data/mockData";
import { User, getCurrentUser, logout } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
}

const ContactList = ({
  contacts,
  selectedContact,
  onSelectContact
}: ContactListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const currentUser = getCurrentUser() as User;
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="h-full w-full object-cover" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{currentUser.name}</span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-2">
          <div className="py-2 px-3">
            <h3 className="text-xs font-medium text-muted-foreground">CONTACTS</h3>
          </div>
          
          {filteredContacts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No contacts found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  className={`flex items-center w-full p-3 space-x-3 rounded-lg transition-colors ${
                    selectedContact?.id === contact.id
                      ? "bg-secondary"
                      : "hover:bg-secondary/50"
                  }`}
                  onClick={() => onSelectContact(contact)}
                >
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col items-start overflow-hidden">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium truncate">{contact.name}</span>
                      {contact.unreadCount > 0 && (
                        <span className="flex-shrink-0 h-5 min-w-5 flex items-center justify-center bg-primary rounded-full text-xs text-primary-foreground font-medium">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {contact.online ? "Active now" : contact.lastSeen}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactList;
